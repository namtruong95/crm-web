import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface CustomerClassificationInterface extends BaseModelInterface {
  name: string;
  type: string;
}
export class CustomerClassification extends BaseModel implements Deserializable<CustomerClassification> {
  private _name: string;
  public get name(): string {
    return this._name || '';
  }
  public set name(v: string) {
    this._name = v;
  }

  type: string;

  constructor() {
    super();
  }

  deserialize(input: Partial<CustomerClassificationInterface>): CustomerClassification {
    if (!input) {
      return;
    }
    super.deserialize(input);
    Object.assign(this, input);
    return this;
  }
}
