import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CustomerCareActivity } from 'models/customer-care-activity';
import { DownloadService } from './download.service';
import { RootScopeService } from 'app/services/root-scope.service';
import { RoleService } from 'app/role.service';
import { Roles } from 'app/guard/roles';

@Injectable({
  providedIn: 'root',
})
export class CareActivityService {
  constructor(
    private _api: ApiService,
    private _download: DownloadService,
    private _rootScope: RootScopeService,
    private _role: RoleService,
  ) {}

  public filterActivities(opts: any = {}) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId = this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._api.get(`care-activity`, { ..._opts, ...opts }).map((res) => {
      res.data.customerCareActivityList = res.data.customerCareActivityList.map((item) =>
        new CustomerCareActivity().deserialize(item),
      );
      return res.data;
    });
  }

  public createCareActivity(data: any) {
    return this._api.post(`care-activity`, data);
  }

  public updateCareActivity(id: number, data: any) {
    return this._api.put(`care-activity/${id}`, data);
  }

  public removeCareActivity(id: number) {
    return this._api.delete(`care-activity/${id}`);
  }

  public exportCCM(opts: any = {}) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId = this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._download.get(`care-activity/export`, { ..._opts, ...opts });
  }
}
