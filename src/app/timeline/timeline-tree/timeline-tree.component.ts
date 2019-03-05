import { Component, OnInit, OnDestroy } from '@angular/core';
import { SaleActivity } from 'models/sale-activity';
import { Observable } from 'rxjs/Observable';
import { Customer } from 'models/customer';
import { of } from 'rxjs/internal/observable/of';
import { concat } from 'rxjs/internal/observable/concat';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CustomerService } from 'shared/services/customer.service';
import { Subject } from 'rxjs/Subject';
import { User } from 'models/user';
import { NotifyService } from 'shared/utils/notify.service';
import { UserService } from 'shared/services/user.service';
import { SaleActivityService } from 'shared/services/sale-activity.service';
import * as moment from 'moment';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { Router } from '@angular/router';
import { Branch } from 'models/branch';
import { RoleService } from 'app/role.service';
import { BranchService } from 'shared/services/branch.service';

@Component({
  selector: 'app-timeline-tree',
  templateUrl: './timeline-tree.component.html',
  styleUrls: ['./timeline-tree.component.scss'],
})
export class TimelineTreeComponent implements OnInit, OnDestroy {
  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();
  public isLoadingCusotmer = false;

  // public staffs: User[] = [];
  // public isLoadingStaff = false;

  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;
  public isLoading = false;

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  public filterTerm: any = {
    customer: null,
    // staff: null,
    dateFrom: null,
    dateTo: null,
    branchId: null,
  };

  public get isEndAfterFrom(): boolean {
    return (
      !!this.filterTerm.dateFrom &&
      !!this.filterTerm.dateTo &&
      moment(this.filterTerm.dateTo).isBefore(moment(this.filterTerm.dateFrom))
    );
  }

  public get filterTermToJSON(): any {
    const opts: any = {};

    if (this.filterTerm.customer) {
      opts.customerId = this.filterTerm.customer.id;
    }
    // if (this.filterTerm.staff) {
    //   opts.staffId = this.filterTerm.staff.id;
    // }
    if (this.filterTerm.dateFrom) {
      opts.dateFrom = moment(this.filterTerm.dateFrom).format('YYYY-MM-DD');
    }
    if (this.filterTerm.dateTo) {
      opts.dateTo = moment(this.filterTerm.dateTo).format('YYYY-MM-DD');
    }

    if (this.filterTerm.branchId) {
      opts.branchId = this.filterTerm.branchId;
    }

    return opts;
  }

  public saleActivities: SaleActivity[] = [];

  get roleAccess(): boolean {
    return this.role.is_admin || this.role.is_sale_director;
  }

  constructor(
    private _customerSv: CustomerService,
    private _userSv: UserService,
    private _notify: NotifyService,
    private _saleActivitySv: SaleActivityService,
    private _emitter: EventEmitterService,
    private _router: Router,
    public role: RoleService,
    private _branchSv: BranchService,
  ) {}

  ngOnInit() {
    this._initSearchCustomers();
    // this._getStaffs();
    this._getBranchList();
  }

  ngOnDestroy() {
    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_SALE_ACTIVITY_2,
      params: {},
    });
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

  // private _getStaffs() {
  //   this.isLoadingStaff = true;

  //   this._userSv.getAllUsers().subscribe(
  //     (res) => {
  //       this.staffs = res;
  //       this.isLoadingStaff = false;
  //     },
  //     (errors) => {
  //       this.isLoadingStaff = false;
  //       this._notify.error(errors);
  //     },
  //   );
  // }

  public filterSaleActivities() {
    if (this.isEndAfterFrom) {
      this._notify.warning('Please select the end time after the start time');
      return;
    }

    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_SALE_ACTIVITY_2,
      params: this.filterTermToJSON,
    });

    if (!this.filterTerm.customer || !this.filterTerm.customer.id) {
      this.saleActivities = [];
      return;
    }

    const opts: any = {
      ...this.filterTermToJSON,
      page: 0,
      size: 1000,
      sort: 'desc',
      column: 'saleDate',
    };
    this.isLoading = true;

    this._saleActivitySv.getSaleActivitiesList(opts).subscribe(
      (res) => {
        if (res.list.length === 0) {
          this._notify.info('data not found');
        }
        this.saleActivities = res.list;
        this.isLoading = false;

        setTimeout(() => {
          $('.timeline-panel').click(function() {
            $('.timeline-body', this).toggle(); // p00f
          });
        }, 0);
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
      },
    );
  }

  public addActivity() {
    if (!this.filterTerm.customer || !this.filterTerm.customer.id) {
      return;
    }

    this._router.navigate(['/timeline/create'], {
      queryParams: {
        customerId: this.filterTerm.customer.id,
      },
    });
  }
}
