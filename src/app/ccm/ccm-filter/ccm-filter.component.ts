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
  };
  public CARE_ACTIVITY_STATUSES = CARE_ACTIVITY_STATUSES;
  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();
  public isLoadingCusotmer = false;
  private subscriber: Subscription;

  constructor(
    private _customerSv: CustomerService,
    private _emitter: EventEmitterService,
    private _notify: NotifyService,
    private _careActivitySv: CareActivityService,
    public ccmSv: CcmService,
  ) {}

  ngOnInit() {
    this._searchCustomers();
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this.subscriber = this._emitter.caseNumber$.subscribe((res) => {});
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
            .filterCustomers({
              page: 0,
              size: 100,
              sort: 'asc',
              column: 'id',
              txtSearch: term,
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
