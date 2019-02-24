import { Component, OnInit } from '@angular/core';
import { Quotation } from 'models/quotation';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyService } from 'shared/utils/notify.service';
import { QuotationService } from 'shared/services/quotation.service';

@Component({
  selector: 'app-quotation-modal-delete',
  templateUrl: './quotation-modal-delete.component.html',
  styleUrls: ['./quotation-modal-delete.component.scss'],
})
export class QuotationModalDeleteComponent implements OnInit {
  public isLoading = false;
  public quotation: Quotation;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _quotationSv: QuotationService,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {}

  public removeQuotation() {
    this.isLoading = true;

    this._quotationSv.deleteQuotation(this.quotation.id).subscribe(
      (res) => {
        this._notify.success('delete quotation successs');
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
