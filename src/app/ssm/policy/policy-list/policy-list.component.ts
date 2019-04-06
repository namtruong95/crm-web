import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueryBuilder } from 'shared/utils/query-builder';
import { Policy } from 'models/policy';
import { Subscription } from 'rxjs/Subscription';

import * as orderBy from 'lodash/orderBy';
import * as clone from 'lodash/clone';

import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyService } from 'shared/utils/notify.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { PolicyService } from 'shared/services/policy.service';
import { PolicyModalEditComponent } from '../policy-modal-edit/policy-modal-edit.component';
import { PolicyModalDeleteComponent } from '../policy-modal-delete/policy-modal-delete.component';
import { RoleService } from 'app/role.service';

interface OrderPolicy {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.scss'],
})
export class PolicyListComponent implements OnInit, OnDestroy {
  public query: QueryBuilder = new QueryBuilder();
  public policyList: Policy[] = [];

  private _subscriber: Subscription;
  private _orderArr: OrderPolicy[] = [];

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

  get canHandlePolicy(): boolean {
    return this._role.is_admin || this._role.is_sale_director;
  }

  constructor(
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _modalService: BsModalService,
    private _policySv: PolicyService,
    private _role: RoleService,
  ) {}

  ngOnInit() {
    this._getListPolicies();
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.FILTER_POLICY) {
        this.query.resetQuery();
        this._filterQuery = data.params;
        this._getListPolicies();
      }

      if (data && data.type === EMITTER_TYPE.CREATE_POLICY) {
        this.query.resetQuery();
        this._getListPolicies();
      }
    });
  }

  private _getListPolicies() {
    const parmas = {
      ...this.query.queryJSON(),
      ...this._filterQuery,
    };
    this._policySv.filterPolicies(parmas).subscribe(
      (res) => {
        this.policyList = res.policyList;
        this.query.setQuery(res);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

  private _openModal(comp, config?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((reason: string) => {
      subscribe.unsubscribe();
      if (reason === 'reload') {
        this._getListPolicies();
      }
    });

    this._modalService.show(comp, config);
  }

  public removePolicy(policy: Policy) {
    const config = {
      class: 'modal-md',
      initialState: {
        policy,
      },
    };

    this._openModal(PolicyModalDeleteComponent, config);
  }

  public editPolicy(policy: Policy) {
    const config = {
      class: 'modal-lg',
      initialState: {
        policy: clone(policy),
      },
    };

    this._openModal(PolicyModalEditComponent, config);
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
    this.policyList = orderBy(this.policyList, this.orderColumnName, this.orderType);
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
    this._getListPolicies();
  }
}
