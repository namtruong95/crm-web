import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Customer } from 'models/customer';
import { DownloadService } from './download.service';
import { RootScopeService } from 'app/services/root-scope.service';
import { Roles } from 'app/guard/roles';
import { RoleService } from 'app/role.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(
    private _api: ApiService,
    private _download: DownloadService,
    private _rootScope: RootScopeService,
    private _role: RoleService,
  ) {}

  public customersList(params?: any) {
    return this._api.get(`customers`, params).map((res) => {
      res.data.customerList = res.data.customerList.map((item) => new Customer().deserialize(item));
      return res.data;
    });
  }

  public showCustomer(id: number, opts?: any) {
    return this._api.get(`customers/${id}`, opts).map((res) => {
      if (res.data && res.data.customer) {
        return new Customer().deserialize(res.data.customer);
      }

      return;
    });
  }

  public filterCustomers(opts?: any) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId = this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._api.get(`customers/filters`, { ..._opts, ...opts }).map((res) => {
      res.data.customerList = res.data.customerList.map((item) => new Customer().deserialize(item));
      return res.data;
    });
  }

  public createCustomer(data: any) {
    return this._api.post(`customers`, data);
  }

  public updateCustomer(id: number, data: any) {
    return this._api.put(`customers/${id}`, data);
  }

  public removeCustomer(id: number) {
    return this._api.delete(`customers/${id}`);
  }

  public exportCustomer(opts?: any) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId = this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._download.get(`customers/export`, { ..._opts, ...opts });
  }
}
