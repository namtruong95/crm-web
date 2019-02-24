import { Injectable } from '@angular/core';
import { KeyCloakUser } from 'models/kc-user';

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

  constructor() {
    this.user = new KeyCloakUser();
  }
}
