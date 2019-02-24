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
      const data = res.data;

      const listUsers: User[] = [];

      res.data.listUsers.forEach((item) => {
        listUsers.push(new User(item));
      });
      return { ...data, listUsers };
    });
  }

  public getAllUsers(opts?: any) {
    return this._api.get(`users/get-all`).map((res) => {
      const listUsers: User[] = [];

      res.data.listUsers.forEach((item) => {
        listUsers.push(new User(item));
      });

      return listUsers;
    });
  }

  public createUser(data: any) {
    return this._api.post(`users`, data);
  }

  public kcCreateUser(data: any) {
    return this._kcApi.post(`users`, data);
  }
}
