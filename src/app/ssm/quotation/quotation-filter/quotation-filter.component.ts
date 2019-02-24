import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Customer } from 'models/customer';
import { of } from 'rxjs/internal/observable/of';
import { Subject } from 'rxjs/Subject';
import { concat } from 'rxjs/internal/observable/concat';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { CustomerService } from 'shared/services/customer.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CustomerClassification } from 'models/customer-classification';
import { NotifyService } from 'shared/utils/notify.service';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { EMITTER_TYPE } from 'constants/emitter';

@Component({
  selector: 'app-quotation-filter',
  templateUrl: './quotation-filter.component.html',
  styleUrls: ['./quotation-filter.component.scss'],
})
export class QuotationFilterComponent implements OnInit {
  public filterTerm: any = {
    customer: null,
    typeOfService: null,
  };

  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();
  public isLoadingCusotmer = false;
  // type of serivice
  public isLoadingTypeOfService = false;
  public typeOfServices: CustomerClassification[] = [];

  constructor(
    private _customerSv: CustomerService,
    private _emitter: EventEmitterService,
    private _notify: NotifyService,
    private _customerClassificationSv: CustomerClassificationService,
  ) {}

  ngOnInit() {
    this._searchCustomers();
    this._getTypeOfServices();
  }

  private _getTypeOfServices() {
    this.isLoadingTypeOfService = true;

    const params = {
      type: 'service-term',
    };
    this.typeOfServices = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingTypeOfService = false;
        this.typeOfServices = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingTypeOfService = false;
        this._notify.error(errors);
      },
    );
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

  public filterQuotation() {
    const params: any = {};

    if (this.filterTerm.customer) {
      params.customerId = this.filterTerm.customer.id;
    }

    if (this.filterTerm.typeOfService) {
      params.typeOfServiceId = this.filterTerm.typeOfService.id;
    }

    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_QUOTATION,
      params,
    });
  }

  public changeCustomer() {
    this._emitter.publishData({
      type: EMITTER_TYPE.CHANGE_CUSTOMER_QUOTATION,
      data: this.filterTerm.customer instanceof Customer ? this.filterTerm.customer.gmapToJSON() : null,
    });
  }
}
