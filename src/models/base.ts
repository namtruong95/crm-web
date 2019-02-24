export interface BaseInterface {
  id: number;
  createdDate?: string;
  updatedDate?: string;
  userId?: number;
}

export class BaseModel {
  private _id: number;
  public get id(): number {
    return this._id || null;
  }
  public set id(v: number) {
    this._id = v;
  }

  private _createdDate: string;
  public get createdDate(): string {
    return this._createdDate;
  }
  public set createdDate(v: string) {
    this._createdDate = v;
  }

  private _updatedDate: string;
  public get updatedDate(): string {
    return this._updatedDate;
  }
  public set updatedDate(v: string) {
    this._updatedDate = v;
  }

  private _userId: number;
  public get userId(): number {
    return this._userId;
  }
  public set userId(v: number) {
    this._userId = v;
  }

  constructor(d?: BaseInterface) {
    if (d) {
      this.id = d.id;
      this.createdDate = d.createdDate;
      this.updatedDate = d.createdDate;
      this.userId = d.userId;
    }
  }
}
