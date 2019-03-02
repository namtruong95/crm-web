import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface TypeOfInvestmentInterface extends BaseModelInterface {
  name: string;
  type: string;
}

export class TypeOfInvestment extends BaseModel implements Deserializable<TypeOfInvestment> {
  name: string;
  type: string;

  constructor() {
    super();
  }

  deserialize(input: Partial<TypeOfInvestmentInterface>): TypeOfInvestment {
    super.deserialize(input);
    Object.assign(this, input);
    return this;
  }
}
