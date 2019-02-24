import { BaseModel } from './base';

export class ManagePdf extends BaseModel {
  private _fileName: string;
  public get fileName(): string {
    return this._fileName;
  }
  public set fileName(v: string) {
    this._fileName = v;
  }

  private _fileType: string;
  public get fileType(): string {
    return this._fileType;
  }
  public set fileType(v: string) {
    this._fileType = v;
  }

  constructor(d?: any) {
    super(d);

    if (d) {
      this.fileName = d.fileName;
      this.fileType = d.fileType;
    }
  }
}
