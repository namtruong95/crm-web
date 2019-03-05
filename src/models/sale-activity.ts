import { Customer } from './customer';
import { User } from './user';
import { CustomerClassification } from './customer-classification';

import * as moment from 'moment';
import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

export enum StatusOfProcess {
  SENT_MAIL = 'Sent Mail',
  CALL = 'Call',
  MEETING_WITH_CUSTOMER = 'Meeting with customer',
  MADE_AND_SEND_QUOTATION = 'Made and sent quotation',
  NEGOTIATION = 'Negotiation',
  SIGNED_CONTRACT = 'Signed contract',
}

interface SaleActivityInterface extends BaseModelInterface {
  customer: Customer;
  staff: User;
  department: string;
  statusOfProcess: CustomerClassification;
  note: string;
  dateBinding: Date;
  saleDate: any;
  customerId: number;
  customerName: string;
  staffId: number;
  staffName: string;
}
export class SaleActivity extends BaseModel implements Deserializable<SaleActivity> {
  private _customer: Customer;
  public get customer(): Customer {
    return this._customer;
  }
  public set customer(v: Customer) {
    this._customer = v;
  }
  public get customer_name(): string {
    return this.customer ? this.customer.customerName : '';
  }

  department: string;

  private _staff: User;
  public get staff(): User {
    return this._staff;
  }
  public set staff(v: User) {
    this._staff = v;
  }
  public get staff_user_name(): string {
    return this.staff ? this.staff.userName : '';
  }
  public get staff_full_name(): string {
    return this.staff ? this.staff.fullName : '';
  }

  private _statusOfProcess: CustomerClassification;
  public get statusOfProcess(): CustomerClassification {
    return this._statusOfProcess;
  }
  public set statusOfProcess(v: CustomerClassification) {
    this._statusOfProcess = v;
  }
  public get statusOfProcessName(): string {
    return this.statusOfProcess ? this.statusOfProcess.name : '';
  }
  public get statusOfProcessIcon(): string {
    if (!this.statusOfProcess || !this.statusOfProcess.name) {
      return;
    }

    switch (this.statusOfProcess.name) {
      case StatusOfProcess.CALL:
        return `fa fa-phone-square`;
      case StatusOfProcess.MADE_AND_SEND_QUOTATION:
        return `fa fa-th-list`;
      case StatusOfProcess.MEETING_WITH_CUSTOMER:
        return `fa fa-comments`;
      case StatusOfProcess.NEGOTIATION:
        return `fa fa-thumbs-up`;
      case StatusOfProcess.SENT_MAIL:
        return `fa fa-envelope`;
      case StatusOfProcess.SIGNED_CONTRACT:
        return `fa fa-check-square`;
    }
  }

  public get statusOfProcessColor(): string {
    if (!this.statusOfProcess || !this.statusOfProcess.name) {
      return;
    }

    switch (this.statusOfProcess.name) {
      case StatusOfProcess.CALL:
        return `primary`;
      case StatusOfProcess.MADE_AND_SEND_QUOTATION:
        return `success`;
      case StatusOfProcess.MEETING_WITH_CUSTOMER:
        return `warning`;
      case StatusOfProcess.NEGOTIATION:
        return `danger`;
      case StatusOfProcess.SENT_MAIL:
        return `info`;
      case StatusOfProcess.SIGNED_CONTRACT:
        return `info`;
    }
  }

  note: string;

  saleDate: any;
  public get date_str(): string {
    return moment(this.saleDate).toISOString();
  }
  public get dateDisplay(): string {
    return moment(this.saleDate).format('YYYY-MM-DD');
  }

  private _dateBinding: Date;
  public get dateBinding(): Date {
    return this._dateBinding;
  }
  public set dateBinding(v: Date) {
    this._dateBinding = v;
  }

  constructor() {
    super();
    this.dateBinding = new Date();
  }

  deserialize(input: Partial<SaleActivityInterface>): SaleActivity {
    super.deserialize(input);
    Object.assign(this, input);

    this.dateBinding = input.saleDate instanceof Date ? input.saleDate : new Date(input.saleDate);

    this.customer = new Customer().deserialize({
      id: input.customerId,
      customerName: input.customerName,
    });

    this.staff = new User().deserialize({
      id: input.staffId,
      fullName: input.staffName,
    });

    this.statusOfProcess =
      input.statusOfProcess instanceof CustomerClassification
        ? input.statusOfProcess
        : new CustomerClassification().deserialize(input.statusOfProcess);

    return this;
  }

  public toJSON() {
    return {
      customerId: this.customer ? this.customer.id : null,
      customerName: this.customer ? this.customer.customerName : null,
      department: this.department || null,
      staffId: this.staff ? this.staff.id : null,
      staffName: this.staff ? this.staff.fullName : null,
      statusOfProcessId: this.statusOfProcess ? this.statusOfProcess.id : null,
      note: this.note || null,
      saleDate: this.date_str,
    };
  }
}
