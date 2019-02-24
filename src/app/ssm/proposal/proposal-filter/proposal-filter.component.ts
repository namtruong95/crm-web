import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/internal/observable/of';
import { Customer } from 'models/customer';
import { concat } from 'rxjs/internal/observable/concat';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CustomerService } from 'shared/services/customer.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { CustomerClassification } from 'models/customer-classification';
import { NotifyService } from 'shared/utils/notify.service';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { ProposalService } from 'shared/services/proposal.service';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
@Component({
  selector: 'app-proposal-filter',
  templateUrl: './proposal-filter.component.html',
  styleUrls: ['./proposal-filter.component.scss'],
})
export class ProposalFilterComponent implements OnInit {
  public filterTerm: any = {
    customer: null,
    typeOfService: null,
    serviceTerm: null,
    bandWidth: 0,
  };

  public get canCreatePdf(): boolean {
    return !!this.filterTerm.customer && !!this.filterTerm.customer.id && this.isFilter;
  }

  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();
  public isLoadingCusotmer = false;

  // type of serivice
  public isLoadingTypeOfService = false;
  public typeOfServices: CustomerClassification[] = [];

  // service term
  public isLoadingServiceTerm = false;
  public serviceTerms: CustomerClassification[] = [];
  public isFilter = false;

  constructor(
    private _customerSv: CustomerService,
    private _emitter: EventEmitterService,
    private _notify: NotifyService,
    private _customerClassificationSv: CustomerClassificationService,
    private _proposalSv: ProposalService,
  ) {}

  ngOnInit() {
    this._searchCustomers();
    this._getTypeOfServices();
    this._getServicesterm();
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

  private _getServicesterm() {
    this.isLoadingServiceTerm = true;

    const params = {
      type: 'service',
    };
    this.serviceTerms = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingServiceTerm = false;
        this.serviceTerms = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingServiceTerm = false;
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
              txtSearch: term || '',
            })
            .pipe(
              catchError(() => of([])), // empty list on error
              tap(() => (this.isLoadingCusotmer = false)),
            ),
        ),
      ),
    );
  }

  public changeCustomer() {
    if (!this.filterTerm.customer) {
      this.isFilter = false;
    }
  }

  public filterProposal() {
    const params: any = {};
    if (this.filterTerm.customer) {
      params.customerId = this.filterTerm.customer.id;
    }
    if (this.filterTerm.typeOfService) {
      params.typeOfServiceId = this.filterTerm.typeOfService.id;
    }
    if (this.filterTerm.serviceTerm) {
      params.serviceTermId = this.filterTerm.serviceTerm.id;
    }
    if (this.filterTerm.bandWidth) {
      params.bandWidth = +this.filterTerm.bandWidth;
    }
    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_PROPOSAL,
      params,
    });

    this.isFilter = true;
  }

  public exportProposal() {
    if (!this.canCreatePdf) {
      this._notify.warning('please select customer and filter');
      return;
    }
    const params: any = {
      page: '0',
      size: '100',
      sort: 'asc',
      column: 'id',
    };

    if (this.filterTerm.customer) {
      params.customerId = this.filterTerm.customer.id;
    }
    if (this.filterTerm.typeOfService) {
      params.typeOfServiceId = this.filterTerm.typeOfService.id;
    }
    if (this.filterTerm.bandWidth) {
      params.bandWidth = this.filterTerm.bandWidth;
    }
    if (this.filterTerm.serviceTerm) {
      params.serviceTermId = this.filterTerm.serviceTerm.id;
    }

    this._proposalSv.exportProposal(params).subscribe(
      (res) => {
        saveAs(res, `proposal-${moment().unix()}.pdf`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
