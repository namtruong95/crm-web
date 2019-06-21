import { Deserializable } from 'shared/interfaces/deserializable';
import { BaseModel, BaseModelInterface } from './base.model';
import { Branch } from './branch';

interface UserInterface extends BaseModelInterface {
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  password: string;
  role: string;
  department: string;
  email: string;
  phoneNumber: string;
  branchId: number;
}

export class User extends BaseModel implements Deserializable<User> {
  private _userName: string;
  public get userName(): string {
    return this._userName;
  }
  public set userName(v: string) {
    this._userName = v ? v.toLowerCase() : '';
  }

  private _firstName: string;
  public get firstName(): string {
    return this._firstName || '';
  }
  public set firstName(v: string) {
    this._firstName = v;
  }

  private _lastName: string;
  public get lastName(): string {
    return this._lastName || '';
  }
  public set lastName(v: string) {
    this._lastName = v;
  }

  private _fullName: string;
  public get fullName(): string {
    return this._fullName;
  }
  public set fullName(v: string) {
    this._fullName = v;
  }

  public get code_full_name(): string {
    let name = this.userName;
    if (this.fullName) {
      name += `- ${this.fullName}`;
    }
    return name;
  }

  password: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  branchId: number;

  constructor() {
    super();
  }

  deserialize(input: Partial<UserInterface>): User {
    if (!input) {
      return;
    }

    super.deserialize(input);
    Object.assign(this, input);
    if (input.phoneNumber) {
      this.phone = input.phoneNumber;
    }
    return this;
  }

  public toJSON() {
    return {
      userName: this.userName || null,
      role: this.role || null,
      email: this.email || null,
      phoneNumber: this.phone || null,
      fullName: this.fullName || null,
      branchId: this.branchId || null,
    };
  }

  public kcToJSON() {
    return {
      userName: this.userName || null,
      email: this.email || null,
      firstName: this.firstName || null,
      lastName: this.lastName || null,
      phoneNumber: this.phone || null,
      password: this.password || null,
      role: this.role || null,
      fullName: this.fullName || null,
    };
  }
}
