import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueryBuilder } from 'shared/utils/query-builder';
import { Subscription } from 'rxjs/Subscription';
import { Bts } from 'models/bts';

import * as orderBy from 'lodash/orderBy';
import * as clone from 'lodash/clone';
import { BtsService } from 'shared/services/bts.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { NotifyService } from 'shared/utils/notify.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BtsModalDeleteComponent } from '../bts-modal-delete/bts-modal-delete.component';
import { BtsModalEditComponent } from '../bts-modal-edit/bts-modal-edit.component';
import { Marker } from 'interfaces/maker';

interface OrderBts {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-bts-list',
  templateUrl: './bts-list.component.html',
  styleUrls: ['./bts-list.component.scss'],
})
export class BtsListComponent implements OnInit, OnDestroy {
  public query: QueryBuilder = new QueryBuilder();
  public btsList: Bts[] = [];
  public get btsMakers(): Marker[] {
    return this.btsList.map((bts) => {
      return bts.markerToJSON();
    });
  }
  private _subscriber: Subscription;
  public isLoading = false;
  private _filterQuery: any = {};

  private _orderArr: OrderBts[] = [];

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
    private _btsSv: BtsService,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _modalService: BsModalService,
  ) {}

  ngOnInit() {
    this._filterBts();
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.FILTER_BTS) {
        this.query.resetQuery();
        this._filterQuery = data.params;
        this._filterBts();
      }

      if (data && data.type === EMITTER_TYPE.CREATE_BTS) {
        this.query.resetQuery();
        this._filterBts();
      }
    });
  }

  private _filterBts() {
    this.isLoading = true;
    const params = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };

    this._btsSv.filterBTS(params).subscribe(
      (res) => {
        this.query.setQuery(res);
        this.btsList = res.btsList;
        this._emitter.publishData({
          type: EMITTER_TYPE.GMAP_BTS,
          data: this.btsMakers,
        });
        this.isLoading = false;
      },
      (errors) => {
        this._notify.error(errors);
        this.isLoading = false;
      },
    );
  }

  private _openModal(comp, config?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((reason: string) => {
      subscribe.unsubscribe();
      if (reason === 'reload') {
        this._filterBts();
      }
    });

    this._modalService.show(comp, config);
  }

  public editBts(bts: Bts) {
    const config = {
      class: 'modal-lg',
      initialState: {
        bts: clone(bts),
      },
    };

    this._openModal(BtsModalEditComponent, config);
  }

  public removeBts(bts: Bts) {
    const config = {
      class: 'modal-md',
      initialState: {
        bts,
      },
    };

    this._openModal(BtsModalDeleteComponent, config);
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
    this.btsList = orderBy(this.btsList, this.orderColumnName, this.orderType);
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
    this._filterBts();
  }
}
