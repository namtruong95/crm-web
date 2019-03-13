import { Component, OnInit } from '@angular/core';
import { ReportService } from 'shared/services/report.service';
import { NotifyService } from 'shared/utils/notify.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-report-sale-activity',
  templateUrl: './report-sale-activity.component.html',
  styleUrls: ['./report-sale-activity.component.scss'],
})
export class ReportSaleActivityComponent implements OnInit {
  constructor(private _notify: NotifyService, private _reportSv: ReportService) {}

  ngOnInit() {}

  public exportReportSaleActivity(event: any = {}) {
    this._reportSv.reportSaleActivity(event).subscribe(
      (res) => {
        saveAs(res, `Sale-Activity-${moment().unix()}.xlsx`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
