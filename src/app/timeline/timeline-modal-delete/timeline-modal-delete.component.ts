import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyService } from 'shared/utils/notify.service';
import { SaleActivity2 } from 'models/sale-activity-2';
import { SaleActivity2Service } from 'shared/services/sale-activity-2.service';

@Component({
  selector: 'app-timeline-modal-delete',
  templateUrl: './timeline-modal-delete.component.html',
  styleUrls: ['./timeline-modal-delete.component.scss'],
})
export class TimelineModalDeleteComponent implements OnInit {
  public isLoading = false;
  public saleActivity: SaleActivity2;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _saleActivity2Sv: SaleActivity2Service,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {}

  public removeSaleActivity() {
    this.isLoading = true;

    this._saleActivity2Sv.removeSaleActivity(this.saleActivity.id).subscribe(
      (res) => {
        this._notify.success('delete sale activity successs');
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
