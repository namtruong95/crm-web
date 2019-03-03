import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface DistrictInterface extends BaseModelInterface {
  name: string;
  branchId: number;
}
export class District extends BaseModel implements Deserializable<District> {
  name: string;
  branchId: number;

  constructor() {
    super();
  }

  deserialize(input: Partial<DistrictInterface>): District {
    super.deserialize(input);
    Object.assign(this, input);
    return this;
  }
}
