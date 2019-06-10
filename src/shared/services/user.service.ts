import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from 'models/user';
import { KeyCloakApiService } from './kc-api.service';
import { RootScopeService } from 'app/services/root-scope.service';
import { Roles, ROLES } from 'app/guard/roles';
import { RoleService } from 'app/role.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private _api: ApiService,
    private _kcApi: KeyCloakApiService,
    private _rootScope: RootScopeService,
    private _role: RoleService,
  ) {}

  public getUsers(opts?: any) {
    return this._api.get(`users`, opts).map((res) => {
      res.data.listUsers = res.data.listUsers.map((item) => new User().deserialize(item));
      return res.data;
    });
  }

  public getAllUsers(opts: any = {}) {
    if (this._role.is_admin || this._role.is_branch_director || this._role.is_sale_director) {
      const _opts: any = {
        role: !!this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
      };

      if (this._role.is_branch_director) {
        _opts.branchId =
          this._rootScope.currentUser.id && this._rootScope.currentUser.branchId
            ? this._rootScope.currentUser.branchId
            : 0;
      }

      return this._api.get(`users/get-all`, { ..._opts, ...opts }).map((res) => {
        return res.data.listUsers.map((item) => new User().deserialize(item));
      });
    }

    return Observable.of([this._rootScope.currentUser]).delay(500);
  }

  public getAllUsersInBranch(opts: any = {}) {
    const _opts = {
      role: !!this._rootScope.currentUser.id
        ? this._role.is_sale_director || this._role.is_admin
          ? this._rootScope.currentUser.role
          : Roles.BRANCH_DIRECTOR
        : Roles.MYTEL_ADMIN,
      branchId:
        this._rootScope.currentUser.id && this._rootScope.currentUser.branchId
          ? this._rootScope.currentUser.branchId
          : 0,
      ...opts,
    };

    return this._api.get(`users/get-all`, _opts).map((res) => {
      return res.data.listUsers.map((item) => new User().deserialize(item));
    });
  }

  public createUser(data: any) {
    return this._api.post(`users`, data);
  }

  public updateUser(id: number, data: any) {
    return this._api.put(`users/${id}`, data);
  }

  public kcCreateUser(data: any) {
    return this._kcApi.post(`users`, data);
  }

  public checkUserExists(id: string, opts?: any) {
    return this._api.get(`users/check-user/${id}`, opts);
  }
}
