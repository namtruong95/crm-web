import { Component, OnInit } from '@angular/core';
import { Policy } from 'models/policy';
import { PolicyService } from 'shared/services/policy.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyService } from 'shared/utils/notify.service';

@Component({
  selector: 'app-policy-modal-delete',
  templateUrl: './policy-modal-delete.component.html',
  styleUrls: ['./policy-modal-delete.component.scss'],
})
export class PolicyModalDeleteComponent implements OnInit {
  public isLoading = false;
  public policy: Policy;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _policySv: PolicyService,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {}

  public removePolicy() {
    this.isLoading = true;

    this._policySv.deletePolicy(this.policy.policyId).subscribe(
      (res) => {
        this._notify.success('delete policy successs');
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
