import { Component, OnInit } from '@angular/core';
import { User } from 'models/user';
import { ROLES } from 'app/guard/roles';
import { RegExp } from 'constants/reg-exp';
import { UserService } from 'shared/services/user.service';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { NgForm } from '@angular/forms';
import { BranchService } from 'shared/services/branch.service';
import { Branch } from 'models/branch';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  public user: User = new User();
  public ROLES = ROLES;
  public rules = RegExp;
  public isLoading = false;

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  constructor(
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _userSv: UserService,
    private _branchSv: BranchService,
  ) {}

  ngOnInit() {
    this._getBranchList();
  }

  private _getBranchList() {
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

  public checkAndCreateUser(form: NgForm) {
    this.isLoading = true;
    this._userSv.kcCreateUser(this.user.kcToJSON()).subscribe(
      (res) => {
        this._createUser(form);
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
      },
    );
  }

  private _createUser(form: NgForm) {
    this._userSv.createUser(this.user.toJSON()).subscribe(
      (res) => {
        this._notify.success(res.meta.message);
        this._emitter.publishData({
          type: EMITTER_TYPE.CREATE_USER,
        });
        this.isLoading = false;
        form.form.markAsPristine({ onlySelf: false });
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
      },
      () => {
        setTimeout(() => {
          this.user = new User();
        }, 0);
      },
    );
  }
}
