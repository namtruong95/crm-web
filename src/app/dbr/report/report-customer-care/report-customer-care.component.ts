import { Component, OnInit } from '@angular/core';
import { ReportService } from 'shared/services/report.service';
import { NotifyService } from 'shared/utils/notify.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-report-customer-care',
  templateUrl: './report-customer-care.component.html',
  styleUrls: ['./report-customer-care.component.scss'],
})
export class ReportCustomerCareComponent implements OnInit {
  constructor(private _notify: NotifyService, private _reportSv: ReportService) {}

  ngOnInit() {}

  public exportReportCustomerCare(event: any = {}) {
    this._reportSv.reportCareActivity(event).subscribe(
      (res) => {
        saveAs(res, `Customer-Care-Activity-${moment().unix()}.xlsx`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
