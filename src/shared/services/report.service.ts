import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RoleService } from 'app/role.service';
import { RootScopeService } from 'app/services/root-scope.service';
import { Roles } from 'app/guard/roles';
import { DownloadService } from './download.service';
import { CustomerCareActivity } from 'models/customer-care-activity';
import { Quotation } from 'models/quotation';
import { SaleActivity } from 'models/sale-activity';
import { CustomerSaleActivity } from 'models/customer-sale-activity';

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
      _opts.branchId =
        this._rootScope.currentUser.id && this._rootScope.currentUser.branchId
          ? this._rootScope.currentUser.branchId
          : 0;
    }

    if (this._role.is_hq_sale_staff || this._role.is_branch_sale_staff) {
      _opts.assignedStaffId = this._rootScope.currentUser.id ? this._rootScope.currentUser.id : 0;
    }

    return this._download.get(`report/care-activity`, { ..._opts, ...opts });
  }

  public previewReportCareActivity(opts: any = {}) {
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

    return this._api.get(`report/preview/care-activity`, { ..._opts, ...opts }).map((res) => {
      res.data.careActivityList = res.data.careActivityList.map((item) => new CustomerCareActivity().deserialize(item));
      return res.data;
    });
  }

  public reportSaleActivity(opts: any = {}) {
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

    return this._download.get(`report/sale-activity`, { ..._opts, ...opts });
  }

  public previewReportSaleActivity(opts: any = {}) {
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

    return this._api.get(`report/preview/sale-activity`, { ..._opts, ...opts }).map((res) => {
      res.data.saleActivityList = res.data.saleActivityList.map((item) => {
        return new SaleActivity().deserialize(item);
      });
      return res.data;
    });
  }

  public reportQuotation(opts: any = {}) {
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

    return this._download.get(`report/quotation`, { ..._opts, ...opts });
  }

  public previewReportQuotation(opts: any = {}) {
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

    return this._api.get(`report/preview/quotation`, { ..._opts, ...opts }).map((res) => {
      res.data.quotationList = res.data.quotationList.map((item) => new Quotation().deserialize(item));
      return res.data;
    });
  }

  public reportSchedule(opts: any = {}) {
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

    return this._download.get(`report/schedule`, { ..._opts, ...opts });
  }

  public previewReportSchedule(opts: any = {}) {
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

    return this._api.get(`report/preview/schedule`, { ..._opts, ...opts }).map((res) => {
      res.data.scheduleList = res.data.scheduleList.map((item) => new CustomerSaleActivity().deserialize(item));
      return res.data;
    });
  }
}
