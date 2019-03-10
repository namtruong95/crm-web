import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Customer } from 'models/customer';
import { Subject } from 'rxjs/Subject';
import { concat } from 'rxjs/internal/observable/concat';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { CustomerService } from 'shared/services/customer.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { NotifyService } from 'shared/utils/notify.service';
import { Branch } from 'models/branch';
import { RoleService } from 'app/role.service';
import { BranchService } from 'shared/services/branch.service';

@Component({
  selector: 'app-scheduler-filter',
  templateUrl: './scheduler-filter.component.html',
  styleUrls: ['./scheduler-filter.component.scss'],
})
export class SchedulerFilterComponent implements OnInit {
  public filterTerm = {
    customer: null,
    dateStart: null,
    dateEnd: null,
    branchId: null,
  };
  public get isEndAfterFrom(): boolean {
    return (
      !!this.filterTerm.dateStart &&
      !!this.filterTerm.dateEnd &&
      moment(this.filterTerm.dateEnd).isBefore(moment(this.filterTerm.dateStart))
    );
  }

  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();

  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  public isLoadingCusotmer = false;

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  get roleAccess(): boolean {
    return this._role.is_admin || this._role.is_sale_director;
  }

  constructor(
    private _customerSv: CustomerService,
    private _emitter: EventEmitterService,
    private _notify: NotifyService,
    private _role: RoleService,
    private _branchSv: BranchService,
  ) {}

  ngOnInit() {
    this._initSearchCustomers();
    this._getBranchList();
  }

  private _getBranchList() {
    if (this.roleAccess) {
      this.isLoadingBranch = true;
      this._branchSv.getBranchList().subscribe(
        (res) => {
          this.branches = res.branches;
          this.isLoadingBranch = false;
        },
        (errors) => {
          this.isLoadingBranch = false;
          this._notify.error(errors);
        },
      );
    }
  }

  public filterScheduler() {
    if (this.isEndAfterFrom) {
      this._notify.warning('Please select the end time after the start time');
      return;
    }

    const params: any = {};

    if (this.filterTerm.dateStart) {
      params.datestart = moment(this.filterTerm.dateStart).format('YYYY-MM-DD');
    }
    if (this.filterTerm.dateEnd) {
      params.dateend = moment(this.filterTerm.dateEnd).format('YYYY-MM-DD');
    }
    if (this.filterTerm.customer) {
      params.customerId = this.filterTerm.customer.id;
    }
    if (this.filterTerm.branchId) {
      params.branchId = this.filterTerm.branchId;
    }

    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_SALE_ACTIVITY,
      params,
    });
  }

  private _initSearchCustomers() {
    this._customerSv
      .filterCustomers({
        page: 0,
        size: 100,
        sort: 'asc',
        column: 'id',
      })
      .subscribe((res) => {
        this._searchCustomers(res.customerList);
      });
  }

  private _searchCustomers(customers: Customer[]) {
    this.customers = concat(
      of(customers), // default items
      this.customerInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.isLoadingCusotmer = true)),
        switchMap((term) =>
          this._customerSv
            .filterCustomers({
              page: 0,
              size: 100,
              sort: 'asc',
              column: 'id',
              txtSearch: term || '',
            })
            .map((res) => res.customerList)
            .pipe(
              catchError(() => of([])), // empty list on error
              tap(() => (this.isLoadingCusotmer = false)),
            ),
        ),
      ),
    );
  }
}
