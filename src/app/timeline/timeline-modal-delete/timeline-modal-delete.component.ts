import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyService } from 'shared/utils/notify.service';
import { SaleActivity } from 'models/sale-activity';
import { SaleActivityService } from 'shared/services/sale-activity.service';

@Component({
  selector: 'app-timeline-modal-delete',
  templateUrl: './timeline-modal-delete.component.html',
  styleUrls: ['./timeline-modal-delete.component.scss'],
})
export class TimelineModalDeleteComponent implements OnInit {
  public isLoading = false;
  public saleActivity: SaleActivity;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _saleActivitySv: SaleActivityService,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {}

  public removeSaleActivity() {
    this.isLoading = true;

    this._saleActivitySv.removeSaleActivity(this.saleActivity.id).subscribe(
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
