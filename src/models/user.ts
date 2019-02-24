import { BaseModel } from './base';

export class User extends BaseModel {
  private _userName: string;
  public get userName(): string {
    return this._userName;
  }
  public set userName(v: string) {
    this._userName = v;
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
    return this._fullName || `${this.firstName} ${this.lastName}`.trim() || this.userName;
  }
  public set fullName(v: string) {
    this._fullName = v;
  }

  private _password: string;
  public get password(): string {
    return this._password;
  }
  public set password(v: string) {
    this._password = v;
  }

  private _role: string;
  public get role(): string {
    return this._role;
  }
  public set role(v: string) {
    this._role = v;
  }

  private _department: string;
  public get department(): string {
    return this._department;
  }
  public set department(v: string) {
    this._department = v;
  }

  private _email: string;
  public get email(): string {
    return this._email;
  }
  public set email(v: string) {
    this._email = v;
  }

  private _phone: string;
  public get phone(): string {
    return this._phone;
  }
  public set phone(v: string) {
    this._phone = v;
  }

  constructor(d?: any) {
    super(d);

    if (d) {
      this.userName = d.userName;
      this.firstName = d.firstName;
      this.lastName = d.lastName;
      this.fullName = d.fullName;
      this.password = d.password;
      this.role = d.role;
      this.department = d.department;
      this.email = d.email;
      this.phone = d.phone;
    }
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
