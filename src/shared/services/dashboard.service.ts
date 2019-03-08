import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RootScopeService } from 'app/services/root-scope.service';
import { RoleService } from 'app/role.service';
import { Roles } from 'app/guard/roles';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private _api: ApiService, private _rootScope: RootScopeService, private _role: RoleService) {}

  public getDashboard(opts: any = {}) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId = this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._api.get(`dashboard`, { ..._opts, ...opts }).map((res) => {
      return res.data;
    });
  }
}
