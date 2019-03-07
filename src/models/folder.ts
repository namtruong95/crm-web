import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface FolderInterface extends BaseModelInterface {
  name: string;
}
export class Folder extends BaseModel implements Deserializable<Folder> {
  name: string;

  constructor() {
    super();
  }

  deserialize(input: Partial<FolderInterface>): Folder {
    super.deserialize(input);
    Object.assign(this, input);
    return this;
  }

  public toJSON() {
    return {
      name: this.name,
    };
  }
}
