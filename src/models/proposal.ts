import { Customer } from './customer';
import { Quotation } from './quotation';
import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface ProposalInterface extends BaseModelInterface {
  customer: Customer;
  quotations: Quotation[];
}
export class Proposal extends BaseModel implements Deserializable<Proposal> {
  customer: Customer;
  quotations: Quotation[];

  constructor() {
    super();
    this.customer = new Customer();
    this.quotations = [];
  }

  deserialize(input: Partial<ProposalInterface>): Proposal {
    if (!input) {
      return;
    }
    super.deserialize(input);
    Object.assign(this, input);

    if (input.quotations && input.quotations.length > 0) {
      this.quotations = input.quotations.map((item) => new Quotation().deserialize(item));
    }
    return this;
  }
}
