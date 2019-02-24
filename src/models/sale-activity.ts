import { BaseModel } from './base';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { Customer } from './customer';
import { CustomerClassification } from './customer-classification';
import { User } from './user';

export class SaleActivity extends BaseModel {
  private _nameOfSale: string;
  public get nameOfSale(): string {
    return this._nameOfSale;
  }
  public set nameOfSale(v: string) {
    this._nameOfSale = v;
  }

  private _date: any;
  public get date(): any {
    return this._date;
  }
  public set date(v: any) {
    this._date = v;
  }
  public get date_str(): string {
    return moment(this.date).format('YYYY-MM-DD');
  }

  private _time_start: string;
  public get time_start(): string {
    return this._time_start;
  }
  public set time_start(v: string) {
    this._time_start = v;
  }
  public get start(): string {
    return `${this.date_str} ${this.time_start}`;
  }
  public get end(): string {
    return `${this.date_str} ${this.time_end}`;
  }
  public get endAfterStart(): boolean {
    return moment(this.end).isAfter(moment(this.start));
  }

  private _time_end: string;
  public get time_end(): string {
    return this._time_end;
  }
  public set time_end(v: string) {
    this._time_end = v;
  }

  public get title(): string {
    return `${this.time_start}~${this.time_end} ${this.nameOfSale}`;
  }
  private _actionOfSale: CustomerClassification;
  public get actionOfSale(): CustomerClassification {
    return this._actionOfSale;
  }
  public set actionOfSale(v: CustomerClassification) {
    this._actionOfSale = v;
  }
  public get actionOfSaleName(): string {
    return this.actionOfSale ? this.actionOfSale.name : null;
  }

  private _staff: User;
  public get staff(): User {
    return this._staff;
  }
  public set staff(v: User) {
    this._staff = v;
  }

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

  constructor(d?: any) {
    super(d);
    this.customer = new Customer();
    this.time_start = moment().format('HH:mm');
    this.date = moment().toDate();
    this.time_end = moment().format('HH:mm');
    this.actionOfSale = new CustomerClassification();
    this.staff = new User();

    if (d) {
      this.nameOfSale = d.nameOfSale;
      this.date = d.date || moment(d.dateStart).toDate();
      this.time_start = d.time_start || moment(d.dateStart).format('HH:mm');
      this.time_end = d.time_end || moment(d.dateEnd).format('HH:mm');
      this.actionOfSale = new CustomerClassification(d.actionOfSale);
      this.customer = new Customer(d.customer);

      if (d.staff instanceof User) {
        this.staff = new User(d.staff);
      } else {
        this.staff = new User({
          fullName: d.staff,
          email: d.staffMail,
          id: d.staffId,
        });
      }
    }
  }

  public toJSON() {
    return {
      customerId: this.customer ? this.customer.id : null,
      dateStart: moment(`${this.date_str} ${this.time_start}`, 'YYYY-MM-DD HH:mm').toISOString(),
      dateEnd: moment(`${this.date_str} ${this.time_end}`, 'YYYY-MM-DD HH:mm').toISOString(),
      nameOfSale: this.nameOfSale || null,
      staff: this.staff ? this.staff.fullName : null,
      staffId: this.staff ? this.staff.id : null,
      actionOfSaleId: this.actionOfSale ? this.actionOfSale.id : null,
    };
  }
}
