import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from 'shared/services/customer.service';
import { NotifyService } from 'shared/utils/notify.service';
import { QueryBuilder } from 'shared/utils/query-builder';
import { Customer } from 'models/customer';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { Subscription } from 'rxjs/Subscription';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { CustomerModalDeleteComponent } from '../customer-modal-delete/customer-modal-delete.component';
import { CustomerModalEditComponent } from '../customer-modal-edit/customer-modal-edit.component';

import * as clone from 'lodash/clone';
import * as orderBy from 'lodash/orderBy';
import { CimService } from '../cim.service';
import { CustomerModalAssignComponent } from '../customer-modal-assign/customer-modal-assign.component';

interface OrderCustomer {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public query: QueryBuilder = new QueryBuilder();
  public customerList: Customer[] = [];
  private _filterQuery: any = {};

  private _subscriber: Subscription;
  private _orderArr: OrderCustomer[] = [];

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
    private _customerSv: CustomerService,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _modalService: BsModalService,
    private _cimSv: CimService,
  ) {}

  ngOnInit() {
    this._filterCustomers();
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.FILTER_CUSTOMER) {
        this.query.resetQuery();
        this._filterQuery = data.params;
        this._filterCustomers();
      }

      if (data && data.type === EMITTER_TYPE.CREATE_CUSTOMER) {
        this.query.resetQuery();
        this._filterCustomers();
      }
    });
  }

  private _filterCustomers() {
    this.isLoading = true;
    const params = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };

    this._customerSv.filterListCustomers(params).subscribe(
      (res) => {
        this.query.setQuery(res);
        this.customerList = res.customerList;
        this._cimSv.date = res.date;

        this.isLoading = false;
      },
      (errors) => {
        this._notify.error(errors);
        this.isLoading = false;
      },
    );
  }

  public pageChanged(event) {
    this.query.currentPage = event.page;
    this._filterCustomers();
  }

  private _openModal(comp, config?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((reason: string) => {
      subscribe.unsubscribe();
      if (reason === 'reload') {
        this._filterCustomers();
      }
    });

    this._modalService.show(comp, config);
  }

  public removeCustomer(customer: Customer) {
    const config = {
      class: 'modal-md',
      initialState: {
        customer: customer,
      },
    };

    this._openModal(CustomerModalDeleteComponent, config);
  }

  public editCustomer(customer: Customer) {
    const config = {
      class: 'modal-lg',
      initialState: {
        customer: clone(customer),
      },
    };

    this._openModal(CustomerModalEditComponent, config);
  }

  public assignedFotStaff(customer: Customer) {
    const config = {
      class: 'modal-md',
      initialState: {
        customer: clone(customer),
      },
    };

    this._openModal(CustomerModalAssignComponent, config);
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
    this.customerList = orderBy(this.customerList, this.orderColumnName, this.orderType);
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
}
