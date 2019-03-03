import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import * as moment from 'moment';
import { SaleActivity } from 'models/sale-activity';
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

  constructor(
    private _customerSv: CustomerService,
    private _emitter: EventEmitterService,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {
    this._searchCustomers();
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
    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_SALE_ACTIVITY,
      params,
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
}
