import { Component, OnInit } from '@angular/core';
import { User } from 'models/user';
import { ROLES } from 'app/guard/roles';
import { Branch } from 'models/branch';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyService } from 'shared/utils/notify.service';
import { BranchService } from 'shared/services/branch.service';
import { UserService } from 'shared/services/user.service';
import { RegExp } from 'constants/reg-exp';

@Component({
  selector: 'app-user-modal-edit',
  templateUrl: './user-modal-edit.component.html',
  styleUrls: ['./user-modal-edit.component.scss'],
})
export class UserModalEditComponent implements OnInit {
  public user: User = new User();

  public ROLES = ROLES;
  public rules = RegExp;

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  public isLoading = false;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _notify: NotifyService,
    private _branchSv: BranchService,
    private _userSv: UserService,
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

  updateUser() {
    this._userSv.updateUser(this.user.id, this.user.toJSON()).subscribe(
      (res) => {
        this._notify.success(res.meta.message);
        this.close('reload');
        this.isLoading = false;
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
      },
    );
  }

  public close(reason?: string) {
    this._modalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }
}
