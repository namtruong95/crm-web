import { Component, OnInit } from '@angular/core';
import { ReportService } from 'shared/services/report.service';
import { NotifyService } from 'shared/utils/notify.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-report-scheduler',
  templateUrl: './report-scheduler.component.html',
  styleUrls: ['./report-scheduler.component.scss'],
})
export class ReportSchedulerComponent implements OnInit {
  constructor(private _notify: NotifyService, private _reportSv: ReportService) {}

  ngOnInit() {}

  public exportReportScheduler(event: any = {}) {
    this._reportSv.reportSchedule(event).subscribe(
      (res) => {
        saveAs(res, `Schedule-Information-${moment().unix()}.xlsx`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
