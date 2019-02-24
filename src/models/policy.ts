import { BaseModel } from './base';
import { CustomerClassification } from './customer-classification';

export class Policy extends BaseModel {
  private _policyId: number;
  public get policyId(): number {
    return this._policyId;
  }
  public set policyId(v: number) {
    this._policyId = v;
  }

  private _policyName: string;
  public get policyName(): string {
    return this._policyName;
  }
  public set policyName(v: string) {
    this._policyName = v;
  }

  private _serviceTerm: CustomerClassification;
  public get serviceTerm(): CustomerClassification {
    return this._serviceTerm;
  }
  public set serviceTerm(v: CustomerClassification) {
    this._serviceTerm = v;
  }
  public get serviceTermName(): string {
    return this.serviceTerm ? this.serviceTerm.name : '';
  }

  private _bandWidth: number;
  public get bandWidth(): number {
    return +this._bandWidth || 0;
  }
  public set bandWidth(v: number) {
    this._bandWidth = v;
  }

  private _typeOfService: CustomerClassification;
  public get typeOfService(): CustomerClassification {
    return this._typeOfService;
  }
  public set typeOfService(v: CustomerClassification) {
    this._typeOfService = v;
  }
  public get typeOfServiceName(): string {
    return this.typeOfService ? this.typeOfService.name : '';
  }

  private _minDistance: number;
  public get minDistance(): number {
    return +this._minDistance || 0;
  }
  public set minDistance(v: number) {
    this._minDistance = v;
  }

  private _maxDistance: number;
  public get maxDistance(): number {
    return +this._maxDistance || 0;
  }
  public set maxDistance(v: number) {
    this._maxDistance = v;
  }

  private _otc: string;
  public get otc(): string {
    return this._otc || '0';
  }
  public set otc(v: string) {
    this._otc = v;
  }

  private _mrcMin: string;
  public get mrcMin(): string {
    return this._mrcMin || '0';
  }
  public set mrcMin(v: string) {
    this._mrcMin = v;
  }

  private _mrcMax: string;
  public get mrcMax(): string {
    return this._mrcMax || '0';
  }
  public set mrcMax(v: string) {
    this._mrcMax = v;
  }

  constructor(d?: any) {
    super(d);
    this.typeOfService = new CustomerClassification();
    this.serviceTerm = new CustomerClassification();

    if (d) {
      this.policyId = d.policyId;
      this.policyName = d.policyName;
      this.serviceTerm = new CustomerClassification(d.serviceTerm);
      this.bandWidth = d.bandWidth;
      this.typeOfService = new CustomerClassification(d.typeOfService);
      this.minDistance = d.minDistance;
      this.maxDistance = d.maxDistance;
      this.otc = d.otc;
      this.mrcMin = d.mrcMin;
      this.mrcMax = d.mrcMax;
    }
  }

  public toJSON() {
    return {
      policyName: this.policyName || null,
      serviceTermId: this.serviceTerm ? this.serviceTerm.id : null,
      bandWidth: this.bandWidth || null,
      typeOfServiceId: this.typeOfService ? this.typeOfService.id : null,
      minDistance: this.minDistance || null,
      maxDistance: this.maxDistance || null,
      otc: this.otc.toNumber() || 0,
      mrcMin: this.mrcMin.toNumber() || 0,
      mrcMax: this.mrcMax.toNumber() || 0,
    };
  }
}
