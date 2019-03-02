import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';
interface ManagePdfInterface extends BaseModelInterface {
  fileName: string;
  fileType: string;
}

export class ManagePdf extends BaseModel implements Deserializable<ManagePdf> {
  fileName: string;
  fileType: string;

  constructor() {
    super();
  }

  deserialize(input: Partial<ManagePdfInterface>): ManagePdf {
    super.deserialize(input);
    Object.assign(this, input);
    return this;
  }
}
