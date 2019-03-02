import { Injectable } from '@angular/core';
import { KeyCloakUser } from 'models/kc-user';
import { User } from 'models/user';

@Injectable({
  providedIn: 'root',
})
export class RootScopeService {
  private _user: KeyCloakUser;
  public get user(): KeyCloakUser {
    return this._user;
  }
  public set user(v: KeyCloakUser) {
    this._user = v;
  }

  private _currentUser: User;
  public get currentUser(): User {
    return this._currentUser;
  }
  public set currentUser(v: User) {
    this._currentUser = v;
  }

  constructor() {
    this.user = new KeyCloakUser();
    this.currentUser = new User();
  }
}
