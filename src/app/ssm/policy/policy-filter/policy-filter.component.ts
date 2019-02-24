import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { CustomerClassification } from 'models/customer-classification';
import { NotifyService } from 'shared/utils/notify.service';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { PolicyService } from 'shared/services/policy.service';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-policy-filter',
  templateUrl: './policy-filter.component.html',
  styleUrls: ['./policy-filter.component.scss'],
})
export class PolicyFilterComponent implements OnInit {
  public filterTerm = {
    policyName: '',
    serviceTerm: null,
    typeOfService: null,
  };

  public get filterToJSON(): any {
    const params: any = {};
    if (this.filterTerm.policyName) {
      params.policyName = this.filterTerm.policyName.trim();
    }

    if (this.filterTerm.serviceTerm) {
      params.serviceTermId = this.filterTerm.serviceTerm.id;
    }

    if (this.filterTerm.typeOfService) {
      params.typeOfServiceId = this.filterTerm.typeOfService.id;
    }
    return params;
  }

  // type of serivice
  public isLoadingTypeOfService = false;
  public typeOfServices: CustomerClassification[] = [];

  // service term
  public isLoadingServiceTerm = false;
  public serviceTerms: CustomerClassification[] = [];

  constructor(
    private _emitter: EventEmitterService,
    private _notify: NotifyService,
    private _customerClassificationSv: CustomerClassificationService,
    private _policySv: PolicyService,
  ) {}

  ngOnInit() {
    this._getTypeOfServices();
    this._getServicesterm();
  }

  public filterPolicy() {
    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_POLICY,
      params: this.filterToJSON,
    });
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

  public exportPolicy() {
    const params: any = {
      ...this.filterToJSON,
      sort: 'asc',
      column: 'id',
    };

    this._policySv.exportPolicy(params).subscribe(
      (res) => {
        saveAs(res, `policy-${moment().unix()}.xlsx`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
