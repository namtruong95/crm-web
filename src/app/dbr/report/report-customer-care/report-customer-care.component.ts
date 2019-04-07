import { Component, OnInit } from '@angular/core';
import { ReportService } from 'shared/services/report.service';
import { NotifyService } from 'shared/utils/notify.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { QueryBuilder } from 'shared/utils/query-builder';
import { CustomerCareActivity } from 'models/customer-care-activity';
import * as orderBy from 'lodash/orderBy';

interface OrderCareActivity {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-report-customer-care',
  templateUrl: './report-customer-care.component.html',
  styleUrls: ['./report-customer-care.component.scss'],
})
export class ReportCustomerCareComponent implements OnInit {
  public query: QueryBuilder = new QueryBuilder();
  public careActivities: CustomerCareActivity[] = [];

  private _orderArr: OrderCareActivity[] = [];

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

  constructor(private _notify: NotifyService, private _reportSv: ReportService) {}

  ngOnInit() {}

  private _getListCareActivity() {
    const parmas = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };
    this._reportSv.previewReportCareActivity(parmas).subscribe(
      (res) => {
        this.careActivities = res.careActivityList;
        this.query.setQuery(res);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

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

  public previewReportCustomerCare(event: any = {}) {
    this._filterQuery = event;
    this.query.resetQuery();
    this._getListCareActivity();
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
    this.careActivities = orderBy(this.careActivities, this.orderColumnName, this.orderType);
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
    this._getListCareActivity();
  }
}
