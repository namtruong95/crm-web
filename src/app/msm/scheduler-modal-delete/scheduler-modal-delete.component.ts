import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SaleActivityService } from 'shared/services/sale-activity.service';
import { NotifyService } from 'shared/utils/notify.service';
import { SaleActivity } from 'models/sale-activity';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';

@Component({
  selector: 'app-scheduler-modal-delete',
  templateUrl: './scheduler-modal-delete.component.html',
  styleUrls: ['./scheduler-modal-delete.component.scss'],
})
export class SchedulerModalDeleteComponent implements OnInit {
  public isLoading = false;
  public scheduler: SaleActivity;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _saleActivitySv: SaleActivityService,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
  ) {}

  ngOnInit() {}

  public removeScheduler() {
    this.isLoading = true;

    this._saleActivitySv.removeSaleActivities(this.scheduler.id).subscribe(
      (res) => {
        this._notify.success('delete sale activity successs');
        this.close('reload');
        this.isLoading = false;
        this._emitter.publishData({
          type: EMITTER_TYPE.REMOVE_SALE_ACTIVITY,
        });
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
