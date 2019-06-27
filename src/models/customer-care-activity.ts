import { Customer } from './customer';
import * as moment from 'moment';
import { CARE_ACTIVITY_STATUSES_TEXT } from 'constants/care-activity';
import { User } from './user';
import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface CustomerCareActivityInterface extends BaseModelInterface {
  customer: Customer;
  assignedStaff: User;
  date: any;
  dateBinding: Date;
  reason: string;
  type: string;
  status: string;
  giftPrice: string;
  dateActivity: number;
  dateActivityFormat: string;
  assignedStaffId: number;
}

export class CustomerCareActivity extends BaseModel implements Deserializable<CustomerCareActivity> {
  customer: Customer;
  get customerName(): string {
    return this.customer ? this.customer.customerName : null;
  }
  get customerAddress(): string {
    return this.customer ? this.customer.address : null;
  }
  get customerContactName(): string {
    return this.customer ? this.customer.contactName : null;
  }
  get customerPosition(): string {
    return this.customer ? this.customer.position : null;
  }

  assignedStaff: User;

  public get staffName(): string {
    return this.assignedStaff ? this.assignedStaff.fullName : null;
  }

  date: any;
  get date_str(): string {
    return moment(this.date).toISOString();
  }
  get dateDisplay(): string {
    return moment(this.date).format('YYYY-MM-DD');
  }

  private _dateBinding: Date;
  public get dateBinding(): Date {
    return this._dateBinding;
  }
  public set dateBinding(v: Date) {
    this._dateBinding = v;
  }

  reason: string;
  type: string;

  status: string;
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

  dateActivity: number;
  dateActivityFormat: string;
  public get createdDateFormat(): string {
    return moment(this.dateActivity).format('DD/MM/YYYY');
  }

  constructor() {
    super();

    this.date = new Date();
    this.dateBinding = new Date();
    this.assignedStaff = new User();
  }

  deserialize(input: Partial<CustomerCareActivityInterface>): CustomerCareActivity {
    if (!input) {
      return;
    }
    super.deserialize(input);
    Object.assign(this, input);

    if (input.dateActivity) {
      this.date = input.dateActivity;
      this.dateBinding = new Date(input.dateActivity);
    }

    this.customer = input.customer instanceof Customer ? input.customer : new Customer().deserialize(input.customer);
    this.assignedStaff =
      input.assignedStaff instanceof User ? input.assignedStaff : new User().deserialize(input.assignedStaff);

    this.giftPrice = (+input.giftPrice).format();
    return this;
  }

  public toJSON() {
    return {
      customerId: this.customer ? this.customer.id : null,
      dateActivity: this.date_str,
      type: this.type || null,
      reason: this.reason || null,
      giftPrice: this.giftPrice.toNumber() || 0,
      status: this.status || null,
      assignedStaffId: this.assignedStaff ? this.assignedStaff.id : null,
    };
  }
}
