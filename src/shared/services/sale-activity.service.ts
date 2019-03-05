import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SaleActivity } from 'models/sale-activity';
import { RoleService } from 'app/role.service';
import { RootScopeService } from 'app/services/root-scope.service';
import { Roles } from 'app/guard/roles';

@Injectable({
  providedIn: 'root',
})
export class SaleActivityService {
  constructor(private _api: ApiService, private _rootScope: RootScopeService, private _role: RoleService) {}

  public getSaleActivitiesList(opts?: any) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
      branchId: this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0,
      assignedStaffId:
        (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) && this._rootScope.currentUser.id
          ? this._rootScope.currentUser.id
          : 0,
      ...opts,
    };

    return this._api.get(`sale-activities`, _opts).map((res) => {
      res.data.list = res.data.list.map((item) => {
        return new SaleActivity().deserialize(item);
      });
      return res.data;
    });
  }

  public createSaleActivity(data: any) {
    return this._api.post(`sale-activities`, data);
  }

  public updateSaleActivity(id: number, data: any) {
    return this._api.put(`sale-activities/${id}`, data);
  }

  public removeSaleActivity(id: number) {
    return this._api.delete(`sale-activities/${id}`);
  }
}
