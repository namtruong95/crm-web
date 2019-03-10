import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface GroupingInterface {
  state: string;
}

interface CustomerTypeInterface extends BaseModelInterface {
  name: string;
  child: GroupingInterface;
}

export class CustomerType extends BaseModel implements Deserializable<CustomerType> {
  name: string;
  child: GroupingInterface;

  constructor() {
    super();
  }

  deserialize(input: Partial<CustomerTypeInterface>): CustomerType {
    if (!input) {
      return;
    }
    super.deserialize(input);
    Object.assign(this, input);
    return this;
  }
}
