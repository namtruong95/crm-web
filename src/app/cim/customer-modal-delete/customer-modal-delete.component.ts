import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomerService } from 'shared/services/customer.service';
import { Customer } from 'models/customer';
import { NotifyService } from 'shared/utils/notify.service';

@Component({
  selector: 'app-customer-modal-delete',
  templateUrl: './customer-modal-delete.component.html',
  styleUrls: ['./customer-modal-delete.component.scss'],
})
export class CustomerModalDeleteComponent implements OnInit {
  public isLoading = false;
  public customer: Customer;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _customerSv: CustomerService,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {}

  public removeCustomer() {
    this.isLoading = true;

    this._customerSv.removeCustomer(this.customer.id).subscribe(
      (res) => {
        this._notify.success('delete customer successs');
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
