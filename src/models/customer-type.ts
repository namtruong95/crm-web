import { BaseModel } from './base';

interface Grouping {
  state: string;
}

export class CustomerType extends BaseModel {
  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v;
  }

  private _child: Grouping;
  public get child(): Grouping {
    return this._child;
  }
  public set child(v: Grouping) {
    this._child = v;
  }

  constructor(d?: any) {
    super(d);

    if (d) {
      this.name = d.name;
      this.child = d.child;
    }
  }
}
