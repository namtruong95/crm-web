import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomerSaleActivityService } from 'shared/services/customer-sale-activity.service';
import { NotifyService } from 'shared/utils/notify.service';
import { CustomerSaleActivity } from 'models/customer-sale-activity';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';

@Component({
  selector: 'app-scheduler-modal-delete',
  templateUrl: './scheduler-modal-delete.component.html',
  styleUrls: ['./scheduler-modal-delete.component.scss'],
})
export class SchedulerModalDeleteComponent implements OnInit {
  public isLoading = false;
  public scheduler: CustomerSaleActivity;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _customerSaleActivitySv: CustomerSaleActivityService,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
  ) {}

  ngOnInit() {}

  public removeScheduler() {
    this.isLoading = true;

    this._customerSaleActivitySv.removeSaleActivities(this.scheduler.id).subscribe(
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
