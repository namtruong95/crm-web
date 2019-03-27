import { Component, OnInit } from '@angular/core';
import { ReportService } from 'shared/services/report.service';
import { NotifyService } from 'shared/utils/notify.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { QueryBuilder } from 'shared/utils/query-builder';
import { Quotation } from 'models/quotation';
import * as orderBy from 'lodash/orderBy';

interface OrderQuotation {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-report-quotation',
  templateUrl: './report-quotation.component.html',
  styleUrls: ['./report-quotation.component.scss'],
})
export class ReportQuotationComponent implements OnInit {
  public query: QueryBuilder = new QueryBuilder();
  public quotationList: Quotation[] = [];

  private _orderArr: OrderQuotation[] = [];

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

  private _filterQuotations() {
    const parmas = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };
    this._reportSv.previewReportQuotation(parmas).subscribe(
      (res) => {
        this.quotationList = res.quotationList;
        this.query.setQuery(res);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

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

  public previewReportQuotation(event: any = {}) {
    this._filterQuery = event;
    this.query.resetQuery();
    this._filterQuotations();
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
    this.quotationList = orderBy(this.quotationList, this.orderColumnName, this.orderType);
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
    this._filterQuotations();
  }
}
