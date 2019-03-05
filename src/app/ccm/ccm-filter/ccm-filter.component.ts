import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Customer } from 'models/customer';
import { of } from 'rxjs/internal/observable/of';
import { Subject } from 'rxjs/Subject';
import { CustomerService } from 'shared/services/customer.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { NotifyService } from 'shared/utils/notify.service';
import { concat } from 'rxjs/internal/observable/concat';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CARE_ACTIVITY_STATUSES } from 'constants/care-activity';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import * as moment from 'moment';
import { CareActivityService } from 'shared/services/care-activity.service';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs/Subscription';
import { CcmService } from '../ccm.service';
import { Branch } from 'models/branch';
import { RoleService } from 'app/role.service';
import { BranchService } from 'shared/services/branch.service';

@Component({
  selector: 'app-ccm-filter',
  templateUrl: './ccm-filter.component.html',
  styleUrls: ['./ccm-filter.component.scss'],
})
export class CcmFilterComponent implements OnInit, OnDestroy {
  public filterTerm: any = {
    customer: null,
    status: null,
    dateActivity: null,
    branchId: null,
  };

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  public CARE_ACTIVITY_STATUSES = CARE_ACTIVITY_STATUSES;
  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();
  public isLoadingCusotmer = false;
  private subscriber: Subscription;

  get roleAccess(): boolean {
    return this.role.is_admin || this.role.is_sale_director;
  }

  constructor(
    private _customerSv: CustomerService,
    private _emitter: EventEmitterService,
    private _notify: NotifyService,
    private _careActivitySv: CareActivityService,
    public ccmSv: CcmService,
    public role: RoleService,
    private _branchSv: BranchService,
  ) {}

  ngOnInit() {
    this._initSearchCustomers();
    this._onEventEmitter();
    this._getBranchList();
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this.subscriber = this._emitter.caseNumber$.subscribe((res) => {});
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

  public onValueChange(event) {
    this.filterTerm.dateActivity = event;
  }

  public filterCareActivity() {
    const params: any = {};

    if (this.filterTerm.customer) {
      params.customerId = this.filterTerm.customer.id;
    }
    if (this.filterTerm.status) {
      params.status = this.filterTerm.status;
    }
    if (this.filterTerm.dateActivity) {
      params.dateActivity = moment(this.filterTerm.dateActivity).format('YYYY/MM/DD');
    }
    if (this.filterTerm.branchId) {
      params.branchId = this.filterTerm.branchId;
    }
    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_CARE_ACTIVITY,
      params,
    });
  }

  public downloadCCM() {
    if (!this.ccmSv.date) {
      return;
    }

    const params: any = {
      date: this.ccmSv.date,
    };

    if (this.filterTerm.customer) {
      params.customerId = this.filterTerm.customer.id;
    }
    if (this.filterTerm.status) {
      params.status = this.filterTerm.status;
    }
    if (this.filterTerm.dateActivity) {
      params.dateActivity = moment(this.filterTerm.dateActivity).format('YYYY/MM/DD');
    }

    this._careActivitySv.exportCCM(params).subscribe(
      (res) => {
        saveAs(res, `customer-care-activity-${moment().unix()}.xlsx`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
