import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { QueryBuilder } from 'shared/utils/query-builder';
import { SaleActivity } from 'models/sale-activity';

import * as orderBy from 'lodash/orderBy';
import { SaleActivityService } from 'shared/services/sale-activity.service';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { Subscription } from 'rxjs/Subscription';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SchedulerModalEditComponent } from '../scheduler-modal-edit/scheduler-modal-edit.component';
import { SchedulerModalDeleteComponent } from '../scheduler-modal-delete/scheduler-modal-delete.component';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

interface OrderCustomer {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-sale-activity-list',
  templateUrl: './sale-activity-list.component.html',
  styleUrls: ['./sale-activity-list.component.scss'],
})
export class SaleActivityListComponent implements OnInit, OnDestroy {
  public query: QueryBuilder = new QueryBuilder();

  private _orderArr: OrderCustomer[] = [];

  public saleActivities: SaleActivity[] = [];

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

  public _subscriber: Subscription;
  private date: string;

  constructor(
    private _saleActivitySv: SaleActivityService,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _modalService: BsModalService,
  ) {}

  ngOnInit() {
    this._getSaleActivities();
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (
        data &&
        (data.type === EMITTER_TYPE.CREATE_SALE_ACTIVITY ||
          data.type === EMITTER_TYPE.REMOVE_SALE_ACTIVITY ||
          data.type === EMITTER_TYPE.UPDATE_SALE_ACTIVITY)
      ) {
        this.query.resetQuery();
        this._getSaleActivities();
      }

      if (data && data.type === EMITTER_TYPE.FILTER_SALE_ACTIVITY) {
        this.query.resetQuery();
        this._filterQuery = data.params;
        this._getSaleActivities();
      }
    });
  }

  private _getSaleActivities() {
    const params = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };

    this._saleActivitySv.getSaleActivities(params).subscribe(
      (res) => {
        this.saleActivities = res.customerSaleActivityList;
        this.query.setQuery(res);
        this.date = res.date;
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
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
    this._getSaleActivities();
  }

  public editSaleActivity(sAc: SaleActivity) {
    const config = {
      class: 'modal-lg',
      initialState: {
        scheduler: sAc,
      },
    };

    this._openModal(SchedulerModalEditComponent, config);
  }

  public removeSaleActivity(sAc: SaleActivity) {
    const config = {
      class: 'modal-md',
      initialState: {
        scheduler: sAc,
      },
    };

    this._openModal(SchedulerModalDeleteComponent, config);
  }

  private _openModal(comp, config?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((reason: string) => {
      subscribe.unsubscribe();
      if (reason === 'reload') {
        // handle reload calendar
        // this._getSaleActivities();
      }
    });

    this._modalService.show(comp, config);
  }

  public sendMail(sAc: SaleActivity) {
    if (!sAc.customer) {
      this._notify.warning("customer doesn't exists");
      return;
    }

    const data = ['mailto:'];
    if (sAc.customer.email) {
      data.push(sAc.customer.email);
    }
    data.push(
      `?body=Dear ${sAc.customer.customerName}! \n
      I would like to send the meeting schedule as below:\n
      Time: ${sAc.time_start}}\n
      Date: ${sAc.date_str}\n
      Address: \n
      Purpose: ${sAc.actionOfSaleName}\n
      \n
      Thank you!
      `,
    );

    window.location.href = data.join('');
  }

  public exportSaleActivity() {
    const params: any = {};

    if (this.date) {
      params.date = this.date;
    }
    if (this._filterQuery.hasOwnProperty('customerId')) {
      params.customerId = this._filterQuery.customerId;
    }
    if (this._filterQuery.hasOwnProperty('datestart')) {
      params.datestart = this._filterQuery.datestart;
    }
    if (this._filterQuery.hasOwnProperty('dateend')) {
      params.dateend = this._filterQuery.dateend;
    }

    this._saleActivitySv.exportSaleActivity(params).subscribe(
      (res) => {
        saveAs(res, `sale-activity-${moment().unix()}.xlsx`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
