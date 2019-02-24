import { Component, OnInit } from '@angular/core';
import { Customer } from 'models/customer';
import { NotifyService } from 'shared/utils/notify.service';
import { CustomerService } from 'shared/services/customer.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';

@Component({
  selector: 'app-customer-modal-assign',
  templateUrl: './customer-modal-assign.component.html',
  styleUrls: ['./customer-modal-assign.component.scss'],
})
export class CustomerModalAssignComponent implements OnInit {
  // users
  public users: User[] = [];
  public isLoadingUser = false;

  public isLoading = false;
  public customer: Customer;

  constructor(
    private _notify: NotifyService,
    private _customerSv: CustomerService,
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _userSv: UserService,
  ) {}

  ngOnInit() {
    this._getUsers();
  }

  private _getUsers() {
    this.isLoadingUser = true;

    this._userSv.getAllUsers().subscribe(
      (res) => {
        this.users = res;
        this.isLoadingUser = false;
      },
      (errors) => {
        this.isLoadingUser = false;
        this._notify.error(errors);
      },
    );
  }

  public close(reason?: string) {
    this._modalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }

  public assignCustomerForStaff() {
    this.isLoading = true;
    this._customerSv.updateCustomer(this.customer.id, this.customer.toJSON()).subscribe(
      (res) => {
        this.isLoading = true;
        this._notify.success('assigned customer fot staff success');
        this.close('reload');
      },
      (errors) => {
        this._notify.error(errors);
        this.isLoading = true;
      },
    );
  }
}
