import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Policy } from 'models/policy';
import { PolicyService } from 'shared/services/policy.service';
import { NotifyService } from 'shared/utils/notify.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { CustomerClassification } from 'models/customer-classification';
import { RegExp } from 'constants/reg-exp';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { NgForm } from '@angular/forms';
import { ManageFileService } from 'shared/services/manage-file.service';
import { ManagePdf } from 'models/manage-pdf';

@Component({
  selector: 'app-policy-create',
  templateUrl: './policy-create.component.html',
  styleUrls: ['./policy-create.component.scss'],
})
export class PolicyCreateComponent implements OnInit {
  @ViewChild('OTC')
  OTC: ElementRef;
  @ViewChild('MRCMin')
  MRCMin: ElementRef;
  @ViewChild('MRCMax')
  MRCMax: ElementRef;

  public policy: Policy = new Policy();

  public isLoading = false;

  // type of serivice
  public isLoadingTypeOfService = false;
  public typeOfServices: CustomerClassification[] = [];

  // service term
  public isLoadingServiceTerm = false;
  public serviceTerms: CustomerClassification[] = [];

  // policy PDF
  public files: ManagePdf[] = [];
  public isLoadingPolicy = false;

  constructor(
    private _policySv: PolicyService,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _customerClassificationSv: CustomerClassificationService,
    private _manageFileSv: ManageFileService,
  ) {}

  ngOnInit() {
    this.policy.serviceTerm = null;
    this.policy.typeOfService = null;
    this._getTypeOfServices();
    this._getServicesterm();
    this._getFiles();
  }

  private _getFiles() {
    const opts = {
      page: 0,
      size: 1000,
      sort: 'desc',
      column: 'id',
    };
    this.isLoadingPolicy = true;
    this._manageFileSv.getAllFiles(opts).subscribe(
      (res) => {
        this.files = res;
        this.isLoadingPolicy = false;
      },
      (errors) => {
        this.isLoadingPolicy = false;
        this._notify.error(errors);
      },
    );
  }

  public createPolicy(form: NgForm) {
    if (this.policy.bandWidth <= 0) {
      this._notify.warning('Please enter a bandwidth greater than 0');
      return;
    }

    if (this.policy.minDistance > this.policy.maxDistance) {
      this._notify.warning('Please enter max distance greater than min distance');
      return;
    }

    if (this.policy.mrcMin.toNumber() > this.policy.mrcMax.toNumber()) {
      this._notify.warning('Please enter MRC max greater than MRC min');
      return;
    }

    this.isLoading = true;

    this._policySv.createPolicy(this.policy.toJSON()).subscribe(
      (res) => {
        this.isLoading = false;
        this._notify.success('create policy success');
        this._emitter.publishData({
          type: EMITTER_TYPE.CREATE_POLICY,
        });
        form.form.markAsPristine({ onlySelf: false });
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
      },
      () => {
        setTimeout(() => {
          this.policy = new Policy();
          this.policy.serviceTerm = null;
          this.policy.typeOfService = null;
        }, 0);
      },
    );
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

  public changeOtc() {
    if (
      isNaN(this.OTC.nativeElement.value.toNumber()) ||
      this.OTC.nativeElement.value.toNumber() < 0 ||
      this.OTC.nativeElement.value.toNumber() > 5000000
    ) {
      this.OTC.nativeElement.value = this.policy.otc;
      return;
    }
    this.policy.otc = this.OTC.nativeElement.value.toNumber().format();
  }

  public changeMRCMin() {
    if (
      isNaN(this.MRCMin.nativeElement.value.toNumber()) ||
      this.MRCMin.nativeElement.value.toNumber() < 0 ||
      this.MRCMin.nativeElement.value.toNumber() > 150000000
    ) {
      this.MRCMin.nativeElement.value = this.policy.mrcMin;
      return;
    }
    this.policy.mrcMin = this.MRCMin.nativeElement.value.toNumber().format();
  }

  public changeMRCMax() {
    if (
      isNaN(this.MRCMax.nativeElement.value.toNumber()) ||
      this.MRCMax.nativeElement.value.toNumber() < 0 ||
      this.MRCMax.nativeElement.value.toNumber() > 150000000
    ) {
      this.MRCMax.nativeElement.value = this.policy.mrcMax;
      return;
    }
    this.policy.mrcMax = this.MRCMax.nativeElement.value.toNumber().format();
  }
}
