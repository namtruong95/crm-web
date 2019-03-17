import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RoleService } from 'app/role.service';
import { RootScopeService } from 'app/services/root-scope.service';
import { Roles } from 'app/guard/roles';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(
    private _api: ApiService,
    private _role: RoleService,
    private _rootScope: RootScopeService,
    private _download: DownloadService,
  ) {}

  public reportCareActivity(opts: any = {}) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId = this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._download.get(`report/care-activity`, { ..._opts, ...opts });
  }

  public reportSaleActivity(opts: any = {}) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId = this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._download.get(`report/sale-activity`, { ..._opts, ...opts });
  }

  public reportQuotation(opts: any = {}) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId = this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._download.get(`report/quotation`, { ..._opts, ...opts });
  }

  public reportSchedule(opts: any = {}) {
    const _opts: any = {
      role: this._rootScope.currentUser.id ? this._rootScope.currentUser.role : Roles.MYTEL_ADMIN,
    };

    if (this._role.is_branch_director) {
      _opts.branchId = this._rootScope.currentUser.id ? this._rootScope.currentUser.branchId : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._download.get(`report/schedule`, { ..._opts, ...opts });
  }
}
