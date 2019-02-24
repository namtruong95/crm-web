import { Component, OnInit, OnDestroy } from '@angular/core';
import { SaleActivity2 } from 'models/sale-activity-2';
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
import { SaleActivity2Service } from 'shared/services/sale-activity-2.service';
import * as moment from 'moment';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { Router } from '@angular/router';

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

  public filterTerm: any = {
    customer: null,
    // staff: null,
    dateFrom: null,
    dateTo: null,
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

    return opts;
  }

  public saleActivities: SaleActivity2[] = [];

  constructor(
    private _customerSv: CustomerService,
    private _userSv: UserService,
    private _notify: NotifyService,
    private _saleActivity2Sv: SaleActivity2Service,
    private _emitter: EventEmitterService,
    private _router: Router,
  ) {}

  ngOnInit() {
    this._searchCustomers();
    // this._getStaffs();
  }

  ngOnDestroy() {
    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_SALE_ACTIVITY_2,
      params: {},
    });
  }

  private _searchCustomers() {
    this.customers = concat(
      of([]), // default items
      this.customerInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.isLoadingCusotmer = true)),
        switchMap((term) =>
          this._customerSv
            .searchCustomers({
              page: 0,
              size: 100,
              sort: 'asc',
              column: 'id',
              txtSearch: term,
            })
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
      size: 300,
      sort: 'desc',
      column: 'saleDate',
    };
    this.isLoading = true;

    this._saleActivity2Sv.filterSaleActivities(opts).subscribe(
      (res) => {
        if (res.length === 0) {
          this._notify.info('data not found');
        }
        this.saleActivities = res;
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
