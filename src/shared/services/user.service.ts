import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from 'models/user';
import { KeyCloakApiService } from './kc-api.service';
import { RootScopeService } from 'app/services/root-scope.service';
import { Roles } from 'app/guard/roles';
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
    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      return Observable.of([this._rootScope.currentUser]).delay(500);
    }

    const _opts = {
      role: !!this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
      branchId: this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0,
      ...opts,
    };

    return this._api.get(`users/get-all`, _opts).map((res) => {
      return res.data.listUsers.map((item) => new User().deserialize(item));
    });
  }

  public createUser(data: any) {
    return this._api.post(`users`, data);
  }

  public kcCreateUser(data: any) {
    return this._kcApi.post(`users`, data);
  }

  public checkUserExists(id: string, opts?: any) {
    return this._api.get(`users/check-user/${id}`, opts);
  }
}
