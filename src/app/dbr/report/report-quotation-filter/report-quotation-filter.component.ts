import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import * as moment from 'moment';
import { NotifyService } from 'shared/utils/notify.service';
import { Branch } from 'models/branch';
import { RoleService } from 'app/role.service';
import { BranchService } from 'shared/services/branch.service';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';
import { CustomerClassification } from 'models/customer-classification';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';

@Component({
  selector: 'app-report-quotation-filter',
  templateUrl: './report-quotation-filter.component.html',
  styleUrls: ['./report-quotation-filter.component.scss'],
})
export class ReportQuotationFilterComponent implements OnInit {
  @Output()
  changeFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  changeTermPreviewReport: EventEmitter<any> = new EventEmitter<any>();

  public filterTerm = {
    serviceTermId: null,
    typeOfServiceId: null,
    branchId: null,
    assignedStaff: null,
  };

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  // staffs
  public staffs: User[] = [];
  public isLoadingStaff = false;

  // type of serivice
  public isLoadingTypeOfService = false;
  public typeOfServices: CustomerClassification[] = [];

  // service term
  public isLoadingServiceTerm = false;
  public serviceTerms: CustomerClassification[] = [];

  get roleAccess(): boolean {
    return this._role.is_admin || this._role.is_sale_director;
  }

  get roleAccessStaff(): boolean {
    return this.roleAccess || this._role.is_branch_director;
  }

  constructor(
    private _notify: NotifyService,
    private _role: RoleService,
    private _branchSv: BranchService,
    private _userSv: UserService,
    private _customerClassificationSv: CustomerClassificationService,
  ) {}

  ngOnInit() {
    this._getBranchList();
    this._getStaffs();
    this.previewReport();
    this._getServicesterm();
    this._getTypeOfServices();
  }

  private _getServicesterm() {
    this.isLoadingServiceTerm = true;

    const params = {
      type: 'service',
    };
    this.serviceTerms = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingServiceTerm = false;
        this.serviceTerms = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingServiceTerm = false;
        this._notify.error(errors);
      },
    );
  }

  private _getTypeOfServices() {
    this.isLoadingTypeOfService = true;

    const params = {
      type: 'service-term',
    };
    this.typeOfServices = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingTypeOfService = false;
        this.typeOfServices = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingTypeOfService = false;
        this._notify.error(errors);
      },
    );
  }

  private _getBranchList() {
    if (this.roleAccess) {
      this.isLoadingBranch = true;
      this._branchSv.getBranchList().subscribe(
        (res) => {
          this.branches = res.branches;
          this.isLoadingBranch = false;
        },
        (errors) => {
          this.isLoadingBranch = false;
          this._notify.error(errors);
        },
      );
    }
  }

  changeBranch() {
    this._getStaffs();
  }

  private _getStaffs() {
    if (this.roleAccessStaff) {
      this.isLoadingStaff = true;
      const opts: any = {};

      if (this.filterTerm.branchId) {
        opts.branchId = this.filterTerm.branchId;
      }

      this._userSv.getAllUsers(opts).subscribe(
        (res) => {
          this.staffs = res;
          this.isLoadingStaff = false;
        },
        (errors) => {
          this.isLoadingStaff = false;
          this._notify.error(errors);
        },
      );
    }
  }

  private _filterTermToJSON() {
    const params: any = {};

    if (this.filterTerm.assignedStaff) {
      params.assignedStaffId = this.filterTerm.assignedStaff.id;
    }
    if (this.filterTerm.branchId) {
      params.branchId = this.filterTerm.branchId;
    }
    if (this.filterTerm.serviceTermId) {
      params.serviceTermId = this.filterTerm.serviceTermId;
    }
    if (this.filterTerm.typeOfServiceId) {
      params.typeOfServiceId = this.filterTerm.typeOfServiceId;
    }

    return params;
  }

  public exportReport() {
    this.changeFilter.emit(this._filterTermToJSON());
  }

  public previewReport() {
    this.changeTermPreviewReport.emit(this._filterTermToJSON());
  }
}
