import { Component, OnInit } from '@angular/core';
import { ReportService } from 'shared/services/report.service';
import { NotifyService } from 'shared/utils/notify.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { QueryBuilder } from 'shared/utils/query-builder';
import { SaleActivity } from 'models/sale-activity';
import * as orderBy from 'lodash/orderBy';

interface OrderCareActivity {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-report-sale-activity',
  templateUrl: './report-sale-activity.component.html',
  styleUrls: ['./report-sale-activity.component.scss'],
})
export class ReportSaleActivityComponent implements OnInit {
  public query: QueryBuilder = new QueryBuilder();
  public saleActivities: SaleActivity[] = [];

  private _orderArr: OrderCareActivity[] = [];
  private _filterQuery: any = {};

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

  constructor(private _notify: NotifyService, private _reportSv: ReportService) {}

  ngOnInit() {}

  private _getListSaleActivity() {
    const parmas = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };
    this._reportSv.previewReportSaleActivity(parmas).subscribe(
      (res) => {
        this.saleActivities = res.saleActivityList;
        this.query.setQuery(res);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

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

  public previewReportSaleActivity(event: any = {}) {
    this._filterQuery = event;
    this.query.resetQuery();
    this._getListSaleActivity();
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
    this._getListSaleActivity();
  }
}
