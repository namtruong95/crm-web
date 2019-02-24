import { Component, OnInit } from '@angular/core';
import { Bts } from 'models/bts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BtsService } from 'shared/services/bts.service';
import { NotifyService } from 'shared/utils/notify.service';

@Component({
  selector: 'app-bts-modal-delete',
  templateUrl: './bts-modal-delete.component.html',
  styleUrls: ['./bts-modal-delete.component.scss'],
})
export class BtsModalDeleteComponent implements OnInit {
  public isLoading = false;
  public bts: Bts;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _btsSv: BtsService,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {}

  public removeBts() {
    this.isLoading = true;

    this._btsSv.removeBTS(this.bts.id).subscribe(
      (res) => {
        this._notify.success('delete BTS successs');
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
