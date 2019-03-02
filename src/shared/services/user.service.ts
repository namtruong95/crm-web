import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from 'models/user';
import { KeyCloakApiService } from './kc-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _api: ApiService, private _kcApi: KeyCloakApiService) {}

  public getUsers(opts?: any) {
    return this._api.get(`users`, opts).map((res) => {
      res.data.listUsers = res.data.listUsers.map((item) => new User().deserialize(item));
      return res.data;
    });
  }

  public getAllUsers(opts?: any) {
    return this._api.get(`users/get-all`, opts).map((res) => {
      return res.data.listUsers.map((item) => new User().deserialize(item));
    });
  }

  public createUser(data: any) {
    return this._api.post(`users`, data);
  }

  public kcCreateUser(data: any) {
    return this._kcApi.post(`users`, data);
  }
}
