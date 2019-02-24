import { BaseModel } from './base';
import { Customer } from './customer';
import * as moment from 'moment';
import { CARE_ACTIVITY_STATUSES_TEXT } from 'constants/care-activity';
import { User } from './user';

export class CustomerCareActivity extends BaseModel {
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
  public get customerAddress(): string {
    return this.customer ? this.customer.address : null;
  }
  public get customerContactName(): string {
    return this.customer ? this.customer.contactName : null;
  }
  public get customerPosition(): string {
    return this.customer ? this.customer.position : null;
  }

  private _staff: User;
  public get staff(): User {
    return this._staff;
  }
  public set staff(v: User) {
    this._staff = v;
  }
  public get staffName(): string {
    return this.staff ? this.staff.fullName : null;
  }

  private _date: any;
  public get date(): any {
    return this._date;
  }
  public set date(v: any) {
    this._date = v;
  }
  public get dateStr(): string {
    return moment(this.date).toISOString();
  }
  public get dateDisplay(): string {
    return moment(this.date).format('YYYY-MM-DD');
  }
  private _dateBinding: Date;
  public get dateBinding(): Date {
    return this._dateBinding;
  }
  public set dateBinding(v: Date) {
    this._dateBinding = v;
  }

  private _reason: string;
  public get reason(): string {
    return this._reason;
  }
  public set reason(v: string) {
    this._reason = v;
  }

  private _type: string;
  public get type(): string {
    return this._type;
  }
  public set type(v: string) {
    this._type = v;
  }

  private _status: string;
  public get status(): string {
    return this._status;
  }
  public set status(v: string) {
    this._status = v;
  }
  public get statusStr(): string {
    return this.status ? CARE_ACTIVITY_STATUSES_TEXT[this.status] : null;
  }

  private _giftPrice: string;
  public get giftPrice(): string {
    return this._giftPrice || '0';
  }
  public set giftPrice(v: string) {
    this._giftPrice = v;
  }

  private _dateActivityFormat: string;
  public get dateActivityFormat(): string {
    return this._dateActivityFormat;
  }
  public set dateActivityFormat(v: string) {
    this._dateActivityFormat = v;
  }

  constructor(d?: any) {
    super(d);
    this.date = new Date();
    this.dateBinding = new Date();
    this.staff = new User();

    if (d) {
      this.customer = new Customer(d.customer);
      this.date = d.dateActivity;
      this.dateBinding = new Date(d.dateActivity);
      this.reason = d.reason;
      this.type = d.type;
      this.status = d.status;
      this.giftPrice = (+d.giftPrice).format();
      this.staff = new User({
        id: d.staffId,
        email: d.staffMail,
        fullName: d.saleCare,
      });
      this.dateActivityFormat = d.dateActivityFormat;
    }
  }

  public toJSON() {
    return {
      customerId: this.customer ? this.customer.id : null,
      dateActivity: this.dateStr,
      type: this.type || null,
      reason: this.reason || null,
      giftPrice: this.giftPrice.toNumber() || null,
      status: this.status || null,
      saleCare: this.staff ? this.staff.fullName : null,
      staffId: this.staff ? this.staff.id : null,
    };
  }
}
