import { Component, OnInit } from '@angular/core';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import * as moment from 'moment';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';
import { Branch } from 'models/branch';
import { RoleService } from 'app/role.service';
import { BranchService } from 'shared/services/branch.service';

@Component({
  selector: 'app-dbr-dashboard-filter',
  templateUrl: './dbr-dashboard-filter.component.html',
  styleUrls: ['./dbr-dashboard-filter.component.scss'],
})
export class DbrDashboardFilterComponent implements OnInit {
  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  public filterTerm: any = {
    saleSatff: null,
    dateFrom: null,
    dateTo: null,
    branchId: null,
  };
  public get isEndAfterFrom(): boolean {
    return (
      !!this.filterTerm.dateFrom &&
      !!this.filterTerm.dateTo &&
      moment(this.filterTerm.dateTo).isBefore(moment(this.filterTerm.dateFrom))
    );
  }

  public staffs: User[] = [];
  public isLoadingStaff = false;

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  get roleAccess(): boolean {
    return this.role.is_admin || this.role.is_sale_director;
  }

  constructor(
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _userSv: UserService,
    public role: RoleService,
    private _branchSv: BranchService,
  ) {}

  ngOnInit() {
    this._getStaffs();
    this._getBranchList();
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

  private _getStaffs() {
    this.isLoadingStaff = true;

    this._userSv.getAllUsers().subscribe(
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

  public filterDashboard() {
    if (this.isEndAfterFrom) {
      this._notify.warning('Please select the end time after the start time');
      return;
    }

    const params: any = {};

    if (this.filterTerm.saleSatff) {
      params.assignedStaffId = this.filterTerm.saleSatff.id;
    }
    if (this.filterTerm.dateFrom) {
      params.dateFrom = moment(this.filterTerm.dateFrom).format('MM/DD/YYYY');
    }
    if (this.filterTerm.dateTo) {
      params.dateTo = moment(this.filterTerm.dateTo).format('MM/DD/YYYY');
    }
    if (this.filterTerm.branchId) {
      params.branchId = this.filterTerm.branchId;
    }

    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_DASHBOARD,
      params,
    });
  }
}
