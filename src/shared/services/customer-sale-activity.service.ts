import { Injectable } from '@angular/core';
import { CustomerSaleActivity } from 'models/customer-sale-activity';
import { ApiService } from './api.service';
import { DownloadService } from './download.service';
import { RootScopeService } from 'app/services/root-scope.service';
import { RoleService } from 'app/role.service';
import { Roles } from 'app/guard/roles';

@Injectable({
  providedIn: 'root',
})
export class CustomerSaleActivityService {
  constructor(
    private _api: ApiService,
    private _download: DownloadService,
    private _rootScope: RootScopeService,
    private _role: RoleService,
  ) {}

  public getSaleActivities(opts: any = {}) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId =
        this._rootScope.currentUser.id && this._rootScope.currentUser.branchId
          ? this._rootScope.currentUser.branchId
          : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._api.get(`sale-activity`, { ..._opts, ...opts }).map((res) => {
      res.data.customerSaleActivityList = res.data.customerSaleActivityList.map((item) =>
        new CustomerSaleActivity().deserialize(item),
      );
      return res.data;
    });
  }

  public createSaleActivities(body: any) {
    return this._api.post(`sale-activity`, body);
  }

  public updateSaleActivities(id: number, body: any) {
    return this._api.put(`sale-activity/${id}`, body);
  }

  public removeSaleActivities(id: number) {
    return this._api.delete(`sale-activity/${id}`);
  }

  public exportSaleActivity(opts: any = {}) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId =
        this._rootScope.currentUser.id && this._rootScope.currentUser.branchId
          ? this._rootScope.currentUser.branchId
          : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._download.get(`sale-activity/export`, { ..._opts, ...opts });
  }
}
