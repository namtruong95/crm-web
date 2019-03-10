import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface TownshipInterface extends BaseModelInterface {
  name: string;
  branchId: number;
  districtId: number;
}
export class Township extends BaseModel implements Deserializable<Township> {
  name: string;
  branchId: number;
  districtId: number;

  constructor() {
    super();
  }

  deserialize(input: Partial<TownshipInterface>): Township {
    if (!input) {
      return;
    }
    super.deserialize(input);
    Object.assign(this, input);
    return this;
  }
}
