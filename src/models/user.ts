import { Deserializable } from 'shared/interfaces/deserializable';
import { BaseModel, BaseModelInterface } from './base.model';

interface UserInterface extends BaseModelInterface {
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  password: string;
  role: string;
  department: string;
  email: string;
  phone: string;
}

export class User extends BaseModel implements Deserializable<User> {
  userName: string;

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
    return this._fullName || this.userName || `${this.firstName} ${this.lastName}`.trim();
  }
  public set fullName(v: string) {
    this._fullName = v;
  }

  password: string;
  role: string;
  department: string;
  email: string;
  phone: string;

  constructor() {
    super();
  }

  deserialize(input: Partial<UserInterface>): User {
    super.deserialize(input);
    Object.assign(this, input);
    return this;
  }

  public toJSON() {
    return {
      userName: this.userName || null,
      department: this.department || null,
      role: this.role || null,
      email: this.email || null,
      phone: this.phone || null,
      firstName: this.firstName || null,
      lastName: this.lastName || null,
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
    };
  }
}
