import { Component, OnInit } from '@angular/core';
import { ReportService } from 'shared/services/report.service';
import { NotifyService } from 'shared/utils/notify.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { QueryBuilder } from 'shared/utils/query-builder';
import { CustomerSaleActivity } from 'models/customer-sale-activity';
import * as orderBy from 'lodash/orderBy';
import { RoleService } from 'app/role.service';

interface OrderCustomer {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-report-scheduler',
  templateUrl: './report-scheduler.component.html',
  styleUrls: ['./report-scheduler.component.scss'],
})
export class ReportSchedulerComponent implements OnInit {
  public query: QueryBuilder = new QueryBuilder();

  private _orderArr: OrderCustomer[] = [];

  public saleActivities: CustomerSaleActivity[] = [];

  public get orderColumnName(): string[] {
    return this._orderArr.map((item) => {
      return item.columnName;
    });
  }
  public get orderType(): string[] {
    return this._orderArr.map((item) => {
      return item.type;
    });
  }
  private _filterQuery: any = {};
  get roleAccess(): boolean {
    return this.role.is_admin || this.role.is_sale_director;
  }

  constructor(private _notify: NotifyService, private _reportSv: ReportService, public role: RoleService) {}

  ngOnInit() {}

  private _getSaleActivities() {
    const params = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };

    this._reportSv.previewReportSchedule(params).subscribe(
      (res) => {
        this.saleActivities = res.scheduleList;
        this.query.setQuery(res);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

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

  public previewReportScheduler(event: any = {}) {
    this._filterQuery = event;
    this.query.resetQuery();
    this._getSaleActivities();
  }

  public addOrder(columnName: string) {
    const index = this._orderArr.findIndex((item) => item.columnName === columnName);

    if (this._orderArr.length > 0 && this._orderArr[0].columnName === columnName) {
      if (this._orderArr[0].type === 'desc') {
        this._orderArr[0].type = 'asc';
      } else {
        this._orderArr[0].type = 'desc';
      }
    } else {
      this._orderArr = [];
      this._orderArr.push({
        columnName: columnName,
        type: 'desc',
      });
    }

    setTimeout(() => {
      this._orderCustomer();
    }, 0);
  }

  private _orderCustomer() {
    this.saleActivities = orderBy(this.saleActivities, this.orderColumnName, this.orderType);
  }

  public getClassOrder(columnName: string): string {
    if (this._orderArr.length > 0 && this._orderArr[0].columnName === columnName) {
      if (this._orderArr[0].type === 'desc') {
        return 'fa-sort-down';
      }
      return 'fa-sort-up';
    }
    return 'fa-sort';
  }

  public pageChanged(event) {
    this.query.currentPage = event.page;
    this._getSaleActivities();
  }
}
