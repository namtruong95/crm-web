import { Customer } from './customer';
import { CustomerClassification } from './customer-classification';
import { Bts } from './bts';
import { Marker } from 'interfaces/maker';
import { User } from './user';
import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface QuotationInterface extends BaseModelInterface {
  customer: Customer;
  typeOfService: CustomerClassification;
  bandWidth: number;
  distance: number;
  otc: string;
  mrc: string;
  totalPrice: number;
  reduceOtc: number;
  reduceMrc: number;
  realPrice: number;
  timeForHire: number;
  timeForProvide: number;
  serviceTerm: CustomerClassification;
  bts: Bts;
  staff: User;
  saleStaff: string;
  staffMail: string;
  staffId: number;
}

export class Quotation extends BaseModel implements Deserializable<Quotation> {
  private _customer: Customer;
  public get customer(): Customer {
    return this._customer;
  }
  public set customer(v: Customer) {
    this._customer = v;
  }
  public get customerName(): string {
    return this.customer ? this.customer.customerName : null;
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
  public get typeOfServiceValue(): number {
    return +this.typeOfServiceName.split(' ')[0] || 0;
  }

  private _bandWidth: number;
  public get bandWidth(): number {
    return +this._bandWidth || 0;
  }
  public set bandWidth(v: number) {
    this._bandWidth = v;
  }

  private _distance = 0;
  public get distance(): number {
    return +this._distance || 0;
  }
  public set distance(v: number) {
    this._distance = v;
  }
  public get distance_km(): string {
    return `${this.distance} km`;
  }

  private _otc: string;
  public get otc(): string {
    return this._otc || '0';
  }
  public set otc(v: string) {
    this._otc = v;
  }
  public get otcNum(): number {
    return this.otc.toNumber();
  }

  private _mrc: string;
  public get mrc(): string {
    return this._mrc || '0';
  }
  public set mrc(v: string) {
    this._mrc = v;
  }
  public get mrcNum(): number {
    return this.mrc.toNumber();
  }

  private _totalPrice: number;
  public get totalPrice(): number {
    return +this._totalPrice || 0;
  }
  public set totalPrice(v: number) {
    this._totalPrice = +v;
  }
  public get totalPrice_display(): string {
    return `${this.totalPrice.round(10).format()} MMK`;
  }

  private _reduceMrc: number;
  public get reduceMrc(): number {
    return +this._reduceMrc || 0;
  }
  public set reduceMrc(v: number) {
    this._reduceMrc = +v;
  }

  private _realPrice: number;
  public get realPrice(): number {
    return +this._realPrice || 0;
  }
  public set realPrice(v: number) {
    this._realPrice = +v;
  }
  public get realPrice_display(): string {
    return `${this.realPrice.round(10).format()} MMK`;
  }

  private _timeForHire: number;
  public get timeForHire(): number {
    return +this._timeForHire || 0;
  }
  public set timeForHire(v: number) {
    this._timeForHire = v;
  }

  private _timeForProvide: number;
  public get timeForProvide(): number {
    return +this._timeForProvide || 0;
  }
  public set timeForProvide(v: number) {
    this._timeForProvide = v;
  }

  private _reduceOtc: number;
  public get reduceOtc(): number {
    return +this._reduceOtc || 0;
  }
  public set reduceOtc(v: number) {
    this._reduceOtc = +v;
  }

  private _staff: User;
  public get staff(): User {
    return this._staff;
  }
  public set staff(v: User) {
    this._staff = v;
  }
  public get staffName(): string {
    return this.staff ? this.staff.fullName : '';
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

  public get canFilterPolicy(): boolean {
    return !!this.distance && !!this.serviceTerm && !!this.typeOfService && !!this.bandWidth;
  }

  public get total(): number {
    return (this.otc.toNumber() + this.typeOfServiceValue * this.mrc.toNumber()).round(10) || 0;
  }
  public get totalStr(): string {
    return this.total.format();
  }
  public get otcTax(): number {
    return (this.otc.toNumber() * (100 - this.reduceOtc)) / 100 || 0;
  }
  public get mrcTax(): number {
    return (this.mrc.toNumber() * (100 - this.reduceMrc)) / 100 || 0;
  }
  public get totalTax(): number {
    return (this.otcTax + this.mrcTax * this.typeOfServiceValue).round(10) || 0;
  }
  public get totalTaxStr(): string {
    return this.totalTax.format();
  }

  private _bts: Bts;
  public get bts(): Bts {
    return this._bts;
  }
  public set bts(v: Bts) {
    this._bts = v;
  }
  public get markers(): Marker[] {
    const markers: Marker[] = [];
    if (this.customer) {
      markers.push(this.customer.gmapToJSON());
    }
    if (this.bts) {
      markers.push(this.bts.markerToJSON());
    }
    return markers;
  }

  constructor() {
    super();
    this.customer = new Customer();
    this.serviceTerm = new CustomerClassification();
    this.typeOfService = new CustomerClassification();
    this.bts = new Bts();
    this.staff = new User();
  }

  deserialize(input: Partial<QuotationInterface>): Quotation {
    super.deserialize(input);
    Object.assign(this, input);

    this.otc = (+input.otc).format();
    this.mrc = (+input.mrc).format();

    this.staff = new User().deserialize({
      fullName: input.saleStaff,
      email: input.staffMail,
      id: input.staffId,
    });

    this.customer = input.customer instanceof Customer ? input.customer : new Customer().deserialize(input.customer);

    this.typeOfService =
      input.typeOfService instanceof CustomerClassification
        ? input.typeOfService
        : new CustomerClassification().deserialize(input.typeOfService);

    this.serviceTerm =
      input.serviceTerm instanceof CustomerClassification
        ? input.serviceTerm
        : new CustomerClassification().deserialize(input.serviceTerm);

    this.bts = input.bts instanceof Bts ? input.bts : new Bts().deserialize(input.bts);

    return this;
  }

  public toJSON() {
    return {
      customerId: this.customer ? this.customer.id : null,
      typeOfServiceId: this.typeOfService ? this.typeOfService.id : null,
      serviceTermId: this.serviceTerm ? this.serviceTerm.id : null,
      bandWidth: this.bandWidth || null,
      distance: this.distance || null,
      otc: this.otc.toNumber() || 0,
      mrc: this.mrc.toNumber() || 0,
      totalPrice: this.total || null,
      reduceOtc: this.reduceOtc || null,
      reduceMrc: this.reduceMrc || null,
      realPrice: this.totalTax || null,
      timeForHire: this.timeForHire || null,
      timeForProvide: this.timeForProvide || null,
      saleStaff: this.staff ? this.staff.fullName : null,
      staffMail: this.staff ? this.staff.email : null,
      staffId: this.staff ? this.staff.id : null,
      btsId: this.bts ? this.bts.id : null,
    };
  }

  public findPolicyToJSON() {
    return {
      distance: this.distance,
      bandWidth: this.bandWidth,
      serviceTermId: this.serviceTerm.id,
      typeOfServiceId: this.typeOfService.id,
    };
  }
}
