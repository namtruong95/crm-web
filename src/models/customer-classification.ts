import { BaseModel } from './base';

export class CustomerClassification extends BaseModel {
  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v;
  }

  private _type: string;
  public get type(): string {
    return this._type;
  }
  public set type(v: string) {
    this._type = v;
  }

  constructor(d?: any) {
    super(d);

    if (d) {
      this.name = d.name;
      this.type = d.type;
    }
  }
}
