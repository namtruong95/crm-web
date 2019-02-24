import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueryBuilder } from 'shared/utils/query-builder';
import { Subscription } from 'rxjs/Subscription';
import { CustomerCareActivity } from 'models/customer-care-activity';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import * as orderBy from 'lodash/orderBy';
import * as clone from 'lodash/clone';
import { CareActivityService } from 'shared/services/care-activity.service';
import { CcmModalEditComponent } from '../ccm-modal-edit/ccm-modal-edit.component';
import { CcmModalDeleteComponent } from '../ccm-modal-delete/ccm-modal-delete.component';
import { CcmService } from '../ccm.service';

interface OrderCareActivity {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-ccm-list',
  templateUrl: './ccm-list.component.html',
  styleUrls: ['./ccm-list.component.scss'],
})
export class CcmListComponent implements OnInit, OnDestroy {
  public query: QueryBuilder = new QueryBuilder();
  public careActivities: CustomerCareActivity[] = [];

  private _subscriber: Subscription;
  private _orderArr: OrderCareActivity[] = [];

  public get orderColumnName(): string[] {
    return this._orderArr.map((item) => {
      return item.columnName;
    });
  }
  public get orderType(): string[] {
    return this._orderArr.map((item) => {
      return item.type;
    });
  }
  private _filterQuery: any = {};

  constructor(
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _modalService: BsModalService,
    private _careActivitySv: CareActivityService,
    private _ccmSv: CcmService,
  ) {}

  ngOnInit() {
    this._getListCareActivity();
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.FILTER_CARE_ACTIVITY) {
        this.query.resetQuery();
        this._filterQuery = data.params;
        this._getListCareActivity();
      }

      if (data && data.type === EMITTER_TYPE.CREATE_CARE_ACTIVITY) {
        this.query.resetQuery();
        this._getListCareActivity();
      }
    });
  }

  private _getListCareActivity() {
    const parmas = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };
    this._careActivitySv.filterActivities(parmas).subscribe(
      (res) => {
        this._ccmSv.date = res.date;
        this.careActivities = res.customerCareActivityList;
        this.query.setQuery(res);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

  public editCareActivity(careActivity: CustomerCareActivity) {
    const config = {
      class: 'modal-lg',
      initialState: {
        careActivity: clone(careActivity),
      },
    };

    this._openModal(CcmModalEditComponent, config);
  }

  public removeCareActivity(careActivity: CustomerCareActivity) {
    const config = {
      class: 'modal-md',
      initialState: {
        careActivity,
      },
    };

    this._openModal(CcmModalDeleteComponent, config);
  }

  private _openModal(comp, config?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((reason: string) => {
      subscribe.unsubscribe();
      if (reason === 'reload') {
        this._getListCareActivity();
      }
    });

    this._modalService.show(comp, config);
  }

  public addOrder(columnName: string) {
    const index = this._orderArr.findIndex((item) => item.columnName === columnName);

    if (this._orderArr.length > 0 && this._orderArr[0].columnName === columnName) {
      if (this._orderArr[0].type === 'desc') {
        this._orderArr[0].type = 'asc';
      } else {
        this._orderArr[0].type = 'desc';
      }
    } else {
      this._orderArr = [];
      this._orderArr.push({
        columnName: columnName,
        type: 'desc',
      });
    }

    setTimeout(() => {
      this._orderCustomer();
    }, 0);
  }

  private _orderCustomer() {
    this.careActivities = orderBy(this.careActivities, this.orderColumnName, this.orderType);
  }

  public getClassOrder(columnName: string): string {
    if (this._orderArr.length > 0 && this._orderArr[0].columnName === columnName) {
      if (this._orderArr[0].type === 'desc') {
        return 'fa-sort-down';
      }

      return 'fa-sort-up';
    }

    return 'fa-sort';
  }

  public pageChanged(event) {
    this.query.currentPage = event.page;
    this._getListCareActivity();
  }
}
