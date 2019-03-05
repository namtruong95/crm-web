import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import { CustomerSaleActivity } from 'models/customer-sale-activity';
import { Customer } from 'models/customer';
import { CustomerService } from 'shared/services/customer.service';
import { Subject } from 'rxjs/Subject';
import { concat } from 'rxjs/internal/observable/concat';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { NotifyService } from 'shared/utils/notify.service';
import { ActionOfSale } from 'constants/action-of-sale';
import { CustomerSaleActivityService } from 'shared/services/customer-sale-activity.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { CustomerClassification } from 'models/customer-classification';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';

@Component({
  selector: 'app-scheduler-modal-edit',
  templateUrl: './scheduler-modal-edit.component.html',
  styleUrls: ['./scheduler-modal-edit.component.scss'],
})
export class SchedulerModalEditComponent implements OnInit {
  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;
  public staffs: User[] = [];
  public scheduler: CustomerSaleActivity = new CustomerSaleActivity();
  public isLoading = false;
  public isLoadingStaff = false;
  public isLoadingCusotmer = false;
  public customerInput$ = new Subject<string>();

  public customers: Observable<Customer[]> = of([]);
  public actionOfSales = ActionOfSale;

  // type of contact
  public isLoadingTypeOfContact = false;
  public typeOfContacts: CustomerClassification[] = [];

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _customerSv: CustomerService,
    private _customerSaleActivitySv: CustomerSaleActivityService,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _customerClassificationSv: CustomerClassificationService,
    private _userSv: UserService,
  ) {}

  ngOnInit() {
    this._initSearchCustomers();
    this._typeOfContact();
    this._getStaffs();
  }

  private _getStaffs() {
    this.isLoadingStaff = true;

    this._userSv.getAllUsersInBranch().subscribe(
      (res) => {
        this.staffs = res;
        this.isLoadingStaff = false;
      },
      (errors) => {
        this.isLoadingStaff = false;
        this._notify.error(errors);
      },
    );
  }

  private _typeOfContact() {
    this.isLoadingTypeOfContact = true;

    const params = {
      type: 'contact',
    };
    this.typeOfContacts = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingTypeOfContact = false;
        this.typeOfContacts = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingTypeOfContact = false;
        this._notify.error(errors);
      },
    );
  }

  public updateScheduler() {
    if (!this.scheduler.endAfterStart) {
      this._notify.error('please select end time after start time');
      return;
    }
    // call api update scheduler
    this.isLoading = true;
    this._customerSaleActivitySv.updateSaleActivities(this.scheduler.id, this.scheduler.toJSON()).subscribe(
      (res) => {
        this._emitter.publishData({
          type: EMITTER_TYPE.UPDATE_SALE_ACTIVITY,
        });
        this.close('reload');
        this._notify.success('update sale activity success');
        this.isLoading = false;
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
      },
    );
  }

  public close(reason?: string) {
    this._modalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }

  private _initSearchCustomers() {
    this._customerSv
      .filterCustomers({
        page: 0,
        size: 100,
        sort: 'asc',
        column: 'id',
      })
      .subscribe((res) => {
        this._searchCustomers(res.customerList);
      });
  }

  private _searchCustomers(customers: Customer[]) {
    this.customers = concat(
      of(customers), // default items
      this.customerInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.isLoadingCusotmer = true)),
        switchMap((term) =>
          this._customerSv
            .filterCustomers({
              page: 0,
              size: 100,
              sort: 'asc',
              column: 'id',
              txtSearch: term || '',
            })
            .map((res) => res.customerList)
            .pipe(
              catchError(() => of([])), // empty list on error
              tap(() => (this.isLoadingCusotmer = false)),
            ),
        ),
      ),
    );
  }

  public compareWithFn = (a, b) => {
    return a.fullName === b.fullName;
  };
}
