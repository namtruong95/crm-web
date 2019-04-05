import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueryBuilder } from 'shared/utils/query-builder';
import { User } from 'models/user';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from 'shared/services/user.service';
import * as orderBy from 'lodash/orderBy';
import * as cloneDeep from 'lodash/cloneDeep';
import { UserModalEditComponent } from '../user-modal-edit/user-modal-edit.component';

interface OrderUser {
  columnName: string;
  type: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public query: QueryBuilder = new QueryBuilder();
  public userList: User[] = [];

  private _subscriber: Subscription;
  private _orderArr: OrderUser[] = [];

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
    private _userSv: UserService,
  ) {}

  ngOnInit() {
    this._getUsers();
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.CREATE_USER) {
        this.query.resetQuery();
        this._getUsers();
      }
    });
  }

  private _getUsers() {
    this.isLoading = true;
    const params = {
      ...this.query.queryJSON(),
    };

    this._userSv.getUsers(params).subscribe(
      (res) => {
        this.query.setQuery(res);
        this.userList = res.listUsers;
        this.isLoading = false;
      },
      (errors) => {
        this._notify.error(errors);
        this.isLoading = false;
      },
    );
  }

  public pageChanged(event) {
    this.query.currentPage = event.page;
    this._getUsers();
  }

  public editUser(user: User) {
    const config = {
      class: 'modal-lg',
      initialState: {
        user: cloneDeep(user),
      },
    };

    this._openModal(UserModalEditComponent, config);
  }

  private _openModal(comp, config?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((reason: string) => {
      subscribe.unsubscribe();
      if (reason === 'reload') {
        this._getUsers();
      }
    });

    this._modalService.show(comp, config);
  }

  public addOrder(columnName: string) {
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
    this.userList = orderBy(this.userList, this.orderColumnName, this.orderType);
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
}
