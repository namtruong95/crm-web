import { BaseModel } from './base';
import { Customer } from './customer';
import { Quotation } from './quotation';

export class Proposal extends BaseModel {
  private _customer: Customer;
  public get customer(): Customer {
    return this._customer;
  }
  public set customer(v: Customer) {
    this._customer = v;
  }

  private _quotations: Quotation[];
  public get quotations(): Quotation[] {
    return this._quotations;
  }
  public set quotations(v: Quotation[]) {
    this._quotations = v;
  }

  constructor(d?: any) {
    super(d);
    this.customer = new Customer();
    this.quotations = [];

    if (d) {
      this.customer = new Customer(d.customer);
      if (d.quotations && d.quotations.length > 0) {
        d.quotations.forEach((item) => {
          this.quotations.push(new Quotation(item));
        });
      }
    }
  }
}
