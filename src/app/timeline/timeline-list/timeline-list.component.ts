import { Component, OnInit } from '@angular/core';
import { QueryBuilder } from 'shared/utils/query-builder';
import { SaleActivity2 } from 'models/sale-activity-2';
import { Subscription } from 'rxjs/Subscription';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { SaleActivity2Service } from 'shared/services/sale-activity-2.service';
import { NotifyService } from 'shared/utils/notify.service';

import * as clone from 'lodash/clone';
import * as orderBy from 'lodash/orderBy';

import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { TimelineModalDeleteComponent } from '../timeline-modal-delete/timeline-modal-delete.component';
import { TimelineModalEditComponent } from '../timeline-modal-edit/timeline-modal-edit.component';

interface OrderCareActivity {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-timeline-list',
  templateUrl: './timeline-list.component.html',
  styleUrls: ['./timeline-list.component.scss'],
})
export class TimelineListComponent implements OnInit {
  public query: QueryBuilder = new QueryBuilder();
  public saleActivities: SaleActivity2[] = [];

  private _subscriber: Subscription;
  private _orderArr: OrderCareActivity[] = [];
  private _filterQuery: any = {};

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

  constructor(
    private _emitter: EventEmitterService,
    private _saleActivity2Sv: SaleActivity2Service,
    private _notify: NotifyService,
    private _modalService: BsModalService,
  ) {}

  ngOnInit() {
    this._getListSaleActivity();
    this._onEventEmitter();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.CREATE_SALE_ACTIVITY_2) {
        this.query.resetQuery();
        this._getListSaleActivity();
      }

      if (data && data.type === EMITTER_TYPE.FILTER_SALE_ACTIVITY_2) {
        this.query.resetQuery();
        this._filterQuery = data.params;
        this._getListSaleActivity();
      }
    });
  }

  private _getListSaleActivity() {
    const parmas = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };
    this._saleActivity2Sv.getSaleActivitiesList(parmas).subscribe(
      (res) => {
        this.saleActivities = res.list;
        this.query.setQuery(res);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

  public editSareActivity(saleActivity: SaleActivity2) {
    const config = {
      class: 'modal-lg',
      initialState: {
        saleActivity: clone(saleActivity),
      },
    };

    this._openModal(TimelineModalEditComponent, config);
  }

  public removeSareActivity(saleActivity: SaleActivity2) {
    const config = {
      class: 'modal-md',
      initialState: {
        saleActivity,
      },
    };

    this._openModal(TimelineModalDeleteComponent, config);
  }

  private _openModal(comp, config?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((reason: string) => {
      subscribe.unsubscribe();
      if (reason === 'reload') {
        this._getListSaleActivity();
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
    this.saleActivities = orderBy(this.saleActivities, this.orderColumnName, this.orderType);
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
    this._getListSaleActivity();
  }
}
