import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface BranchInterface extends BaseModelInterface {
  name: string;
}
export class Branch extends BaseModel implements Deserializable<Branch> {
  name: string;

  constructor() {
    super();
  }

  deserialize(input: Partial<BranchInterface>): Branch {
    if (!input) {
      return;
    }
    super.deserialize(input);
    Object.assign(this, input);
    return this;
  }
}
