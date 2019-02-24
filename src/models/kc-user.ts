export class KeyCloakUser {
  private _id: string;
  public get id(): string {
    return this._id;
  }
  public set id(v: string) {
    this._id = v;
  }

  private _username: string;
  public get username(): string {
    return this._username || '';
  }
  public set username(v: string) {
    this._username = v;
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

  private _email: string;
  public get email(): string {
    return this._email;
  }
  public set email(v: string) {
    this._email = v;
  }

  constructor(d?: any) {
    if (d) {
      this.id = d.id;
      this.username = d.username;
      this.firstName = d.firstName;
      this.lastName = d.lastName;
      this.email = d.email;
      this.fullName = d.fullName || `${d.firstName || ''} ${d.lastName || ''}`.trim() || d.username;
    }
  }
}
