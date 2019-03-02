import { Customer } from './customer';
import { CustomerClassification } from './customer-classification';
import { User } from './user';
import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';
import * as moment from 'moment';

interface SaleActivityInterface extends BaseModelInterface {
  nameOfSale: string;
  date: any;
  time_start: string;
  time_end: string;
  actionOfSale: CustomerClassification;
  customer: Customer;
  staff: User;
  dateStart: string;
  dateEnd: string;
  staffMail: string;
  staffId: number;
}
export class SaleActivity extends BaseModel implements Deserializable<SaleActivity> {
  nameOfSale: string;

  date: any;
  public get date_str(): string {
    return moment(this.date).format('YYYY-MM-DD');
  }
  public set date_str(v) {}

  time_start: string;
  public get start(): string {
    return `${this.date_str} ${this.time_start}`;
  }
  public set start(v) {}
  public get end(): string {
    return `${this.date_str} ${this.time_end}`;
  }
  public set end(v) {}

  public get endAfterStart(): boolean {
    return moment(this.end).isAfter(moment(this.start));
  }
  public set endAfterStart(v) {}

  time_end: string;

  public get title(): string {
    return `${this.time_start}~${this.time_end} ${this.nameOfSale}`;
  }
  public set title(v) {}

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
  public set actionOfSaleName(v) {}

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
  public set customerName(v) {}

  constructor() {
    super();
    this.customer = new Customer();
    this.time_start = moment().format('HH:mm');
    this.date = moment().toDate();
    this.time_end = moment().format('HH:mm');
    this.actionOfSale = new CustomerClassification();
    this.staff = new User();
  }

  deserialize(input: Partial<SaleActivityInterface>): SaleActivity {
    super.deserialize(input);
    Object.assign(this, input);

    this.date = input.date || moment(input.dateStart).toDate();
    this.time_start = input.time_start || moment(input.dateStart).format('HH:mm');
    this.time_end = input.time_end || moment(input.dateEnd).format('HH:mm');

    if (input.staff instanceof User) {
      this.staff = input.staff;
    } else {
      this.staff = new User().deserialize({
        fullName: input.staff,
        email: input.staffMail,
        id: input.staffId,
      });
    }

    this.actionOfSale =
      input.actionOfSale instanceof CustomerClassification
        ? input.actionOfSale
        : new CustomerClassification().deserialize(input.actionOfSale);

    this.customer = input.customer instanceof Customer ? input.customer : new Customer().deserialize(input.customer);

    return this;
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
