import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';
import { Folder } from './folder';
interface ManagePdfInterface extends BaseModelInterface {
  fileName: string;
  fileType: string;
  folder: Folder;
  folderId: number;
  recordId;
}

export class ManagePdf extends BaseModel implements Deserializable<ManagePdf> {
  fileName: string;
  fileType: string;
  folder: Folder;
  folderId: number;
  recordId: number;
  public get record_id(): string {
    return this.recordId && ('00000' + this.recordId).substr(-5);
  }

  get folder_record_id(): string {
    return `${this.folder ? this.folder.name : 'ROOT'} - ${this.record_id}`;
  }

  constructor() {
    super();
  }

  deserialize(input: Partial<ManagePdfInterface>): ManagePdf {
    if (!input) {
      return;
    }
    super.deserialize(input);
    Object.assign(this, input);

    this.folder = input.folder instanceof Folder ? input.folder : new Folder().deserialize(input.folder);
    return this;
  }
}
