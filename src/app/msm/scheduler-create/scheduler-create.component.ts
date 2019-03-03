import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import { SaleActivity } from 'models/sale-activity';
import { Customer } from 'models/customer';
import { CustomerService } from 'shared/services/customer.service';
import { NotifyService } from 'shared/utils/notify.service';
import { Subject } from 'rxjs/Subject';
import { concat } from 'rxjs/internal/observable/concat';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { SaleActivityService } from 'shared/services/sale-activity.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { ActionOfSale } from 'constants/action-of-sale';
import { CustomerClassification } from 'models/customer-classification';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-scheduler-create',
  templateUrl: './scheduler-create.component.html',
  styleUrls: ['./scheduler-create.component.scss'],
})
export class SchedulerCreateComponent implements OnInit {
  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  public scheduler: SaleActivity = new SaleActivity();

  public staffs: User[] = [];
  public isLoadingStaff = false;
  public isLoadingCusotmer = false;
  public customerInput$ = new Subject<string>();
  public isLoading = false;

  // customer
  public customers: Observable<Customer[]> = of([]);
  public actionOfSales = ActionOfSale;

  // type of contact
  public isLoadingTypeOfContact = false;
  public typeOfContacts: CustomerClassification[] = [];

  constructor(
    private _customerSv: CustomerService,
    private _notify: NotifyService,
    private _saleActivitySv: SaleActivityService,
    private _emitter: EventEmitterService,
    private _customerClassificationSv: CustomerClassificationService,
    private _userSv: UserService,
  ) {}

  ngOnInit() {
    this.scheduler.staff = null;
    this.scheduler.customer = null;
    this.scheduler.actionOfSale = null;

    this._searchCustomers();
    this._typeOfContact();
    this._getStaffs();
  }

  private _getStaffs() {
    this.isLoadingStaff = true;

    this._userSv.getAllUsers().subscribe(
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

  public createScheduler(form: NgForm) {
    if (!this.scheduler.endAfterStart) {
      this._notify.error('please select end time after start time');
      return;
    }

    this.isLoading = true;

    this._saleActivitySv.createSaleActivities(this.scheduler.toJSON()).subscribe(
      (res) => {
        form.form.markAsPristine({ onlySelf: false });
        this.isLoading = false;
        this._emitter.publishData({
          type: EMITTER_TYPE.CREATE_SALE_ACTIVITY,
        });
        this._notify.success(`create sale activity success`);
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
      },
      () => {
        setTimeout(() => {
          this.scheduler = new SaleActivity();
          this.scheduler.staff = null;
          this.scheduler.customer = null;
          this.scheduler.actionOfSale = null;
        }, 0);
      },
    );
  }

  private _searchCustomers() {
    this.customers = concat(
      of([]), // default items
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
              txtSearch: term,
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
}
