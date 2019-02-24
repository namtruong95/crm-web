import { BaseModel } from './base';
import { Customer } from './customer';
import { User } from './user';
import { CustomerClassification } from './customer-classification';

import * as moment from 'moment';

export enum StatusOfProcess {
  SENT_MAIL = 'Sent Mail',
  CALL = 'Call',
  MEETING_WITH_CUSTOMER = 'Meeting with customer',
  MADE_AND_SEND_QUOTATION = 'Made and sent quotation',
  NEGOTIATION = 'Negotiation',
  SIGNED_CONTRACT = 'Signed contract',
}

export class SaleActivity2 extends BaseModel {
  private _customer: Customer;
  public get customer(): Customer {
    return this._customer;
  }
  public set customer(v: Customer) {
    this._customer = v;
  }
  public get customerName(): string {
    return this.customer ? this.customer.customerName : '';
  }

  private _department: string;
  public get department(): string {
    return this._department;
  }
  public set department(v: string) {
    this._department = v;
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

  private _note: string;
  public get note(): string {
    return this._note;
  }
  public set note(v: string) {
    this._note = v;
  }

  private _saleDate: any;
  public get saleDate(): any {
    return this._saleDate;
  }
  public set saleDate(v: any) {
    this._saleDate = v;
  }
  public get dateStr(): string {
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

  constructor(d?: any) {
    super(d);
    this.dateBinding = new Date();

    if (d) {
      this.customer = new Customer({
        id: d.customerId,
        customerName: d.customerName,
      });

      this.staff = new User({
        id: d.staffId,
        fullName: d.staffName,
      });

      this.department = d.department;
      if (d.statusOfProcess) {
        this.statusOfProcess = new CustomerClassification(d.statusOfProcess);
      }
      this.note = d.note;
      this.dateBinding = new Date(d.saleDate);
      this.saleDate = d.saleDate;
    }
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
      saleDate: this.dateStr,
    };
  }
}
