import { Component, OnInit } from '@angular/core';
import { QueryBuilder } from 'shared/utils/query-builder';
import { Quotation } from 'models/quotation';
import { Subscription } from 'rxjs/Subscription';

import * as orderBy from 'lodash/orderBy';
import { QuotationService } from 'shared/services/quotation.service';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { ProposalService } from 'shared/services/proposal.service';

interface OrderQuotation {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss'],
})
export class ProposalListComponent implements OnInit {
  public query: QueryBuilder = new QueryBuilder();
  public proposalList: Quotation[] = [];

  private _subscriber: Subscription;
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

  constructor(
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _proposalSv: ProposalService,
  ) {}

  ngOnInit() {
    this._onEventEmitter();
    this._filterQuotations();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.FILTER_PROPOSAL) {
        this.query.resetQuery();
        this._filterQuery = data.params;
        this._filterQuotations();
      }
    });
  }

  private _filterQuotations() {
    const parmas = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };
    this._proposalSv.filterProposal(parmas).subscribe(
      (res) => {
        this.proposalList = res.proposalList;
        this.query.setQuery(res);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
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
    this.proposalList = orderBy(this.proposalList, this.orderColumnName, this.orderType);
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
