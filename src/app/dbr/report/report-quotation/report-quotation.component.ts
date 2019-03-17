import { Component, OnInit } from '@angular/core';
import { ReportService } from 'shared/services/report.service';
import { NotifyService } from 'shared/utils/notify.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-report-quotation',
  templateUrl: './report-quotation.component.html',
  styleUrls: ['./report-quotation.component.scss'],
})
export class ReportQuotationComponent implements OnInit {
  constructor(private _notify: NotifyService, private _reportSv: ReportService) {}

  ngOnInit() {}

  public exportReportQuotation(event: any = {}) {
    this._reportSv.reportQuotation(event).subscribe(
      (res) => {
        saveAs(res, `Quotation-${moment().unix()}.xlsx`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
