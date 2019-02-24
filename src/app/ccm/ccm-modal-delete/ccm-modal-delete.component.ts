import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyService } from 'shared/utils/notify.service';
import { CareActivityService } from 'shared/services/care-activity.service';
import { CustomerCareActivity } from 'models/customer-care-activity';

@Component({
  selector: 'app-ccm-modal-delete',
  templateUrl: './ccm-modal-delete.component.html',
  styleUrls: ['./ccm-modal-delete.component.scss'],
})
export class CcmModalDeleteComponent implements OnInit {
  public isLoading = false;
  public careActivity: CustomerCareActivity;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _careActivitySv: CareActivityService,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {}

  public removeCareActivity() {
    this.isLoading = true;

    this._careActivitySv.removeCareActivity(this.careActivity.id).subscribe(
      (res) => {
        this._notify.success('delete care activity successs');
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
