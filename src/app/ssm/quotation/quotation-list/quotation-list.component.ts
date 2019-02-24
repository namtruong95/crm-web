import { Quotation } from 'models/quotation';
import { Component, OnInit } from '@angular/core';
import { QueryBuilder } from 'shared/utils/query-builder';
import { Subscription } from 'rxjs/Subscription';

import * as orderBy from 'lodash/orderBy';
import * as clone from 'lodash/clone';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { QuotationService } from 'shared/services/quotation.service';
import { QuotationModalDeleteComponent } from '../quotation-modal-delete/quotation-modal-delete.component';
import { QuotationModalEditComponent } from '../quotation-modal-edit/quotation-modal-edit.component';

import { saveAs } from 'file-saver';
import * as moment from 'moment';

interface OrderQuotation {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss'],
})
export class QuotationListComponent implements OnInit {
  public query: QueryBuilder = new QueryBuilder();
  public quotationList: Quotation[] = [];

  private _subscriber: Subscription;
  private _orderArr: OrderQuotation[] = [];
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
  constructor(
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _modalService: BsModalService,
    private _quotationSv: QuotationService,
  ) {}

  ngOnInit() {
    this._filterQuotations();
    this._onEventEmitter();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.FILTER_QUOTATION) {
        this.query.resetQuery();
        this._filterQuery = data.params;
        this._filterQuotations();
      }

      if (data && data.type === EMITTER_TYPE.CREATE_QUOTATION) {
        this.query.resetQuery();
        this._filterQuotations();
      }
    });
  }

  private _filterQuotations() {
    const parmas = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };
    this._quotationSv.filterQuotations(parmas).subscribe(
      (res) => {
        this.quotationList = res.quotationList;
        this.query.setQuery(res);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

  public editQuotation(quotation: Quotation) {
    const config = {
      class: 'modal-lg',
      initialState: {
        quotation: clone(quotation),
      },
    };

    this._openModal(QuotationModalEditComponent, config);
  }

  public removeQuotation(quotation: Quotation) {
    const config = {
      class: 'modal-md',
      initialState: {
        quotation,
      },
    };

    this._openModal(QuotationModalDeleteComponent, config);
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

  private _openModal(comp, config?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((reason: string) => {
      subscribe.unsubscribe();
      if (reason === 'reload') {
        this._filterQuotations();
      }
    });

    this._modalService.show(comp, config);
  }

  public pageChanged(event) {
    this.query.currentPage = event.page;
    this._filterQuotations();
  }

  public exportQuotation(id: number) {
    const params: any = {
      quotationId: id,
    };

    this._quotationSv.exportQuotation(params).subscribe(
      (res) => {
        saveAs(res, `quotation-${moment().unix()}.pdf`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
