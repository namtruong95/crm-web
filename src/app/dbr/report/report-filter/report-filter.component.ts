import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import * as moment from 'moment';
import { NotifyService } from 'shared/utils/notify.service';
import { Branch } from 'models/branch';
import { RoleService } from 'app/role.service';
import { BranchService } from 'shared/services/branch.service';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';

@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
})
export class ReportFilterComponent implements OnInit {
  @Output()
  changeFilter: EventEmitter<any> = new EventEmitter<any>();

  public filterTerm = {
    dateStart: null,
    dateEnd: null,
    branchId: null,
    assignedStaff: null,
  };
  public get isEndAfterFrom(): boolean {
    return (
      !!this.filterTerm.dateStart &&
      !!this.filterTerm.dateEnd &&
      moment(this.filterTerm.dateEnd).isBefore(moment(this.filterTerm.dateStart))
    );
  }

  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  // staffs
  public staffs: User[] = [];
  public isLoadingStaff = false;

  get roleAccess(): boolean {
    return this._role.is_admin || this._role.is_sale_director;
  }

  constructor(
    private _notify: NotifyService,
    private _role: RoleService,
    private _branchSv: BranchService,
    private _userSv: UserService,
  ) {}

  ngOnInit() {
    this._getBranchList();
    this._getStaffs();
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

    this._userSv.getAllUsersInBranch().subscribe(
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

  public exportReport() {
    if (this.isEndAfterFrom) {
      this._notify.warning('Please select the end time after the start time');
      return;
    }

    const params: any = {};

    if (this.filterTerm.dateStart) {
      params.datestart = moment(this.filterTerm.dateStart).format('YYYY-MM-DD');
    }
    if (this.filterTerm.dateEnd) {
      params.dateend = moment(this.filterTerm.dateEnd).format('YYYY-MM-DD');
    }
    if (this.filterTerm.assignedStaff) {
      params.assignedStaffId = this.filterTerm.assignedStaff.id;
    }
    if (this.filterTerm.branchId) {
      params.branchId = this.filterTerm.branchId;
    }

    this.changeFilter.emit(params);

    // emitter event filter
  }
}
