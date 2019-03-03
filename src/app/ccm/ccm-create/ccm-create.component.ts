import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomerCareActivity } from 'models/customer-care-activity';
import { Observable } from 'rxjs/Observable';
import { Customer } from 'models/customer';
import { of } from 'rxjs/internal/observable/of';
import { Subject } from 'rxjs/Subject';
import { CustomerService } from 'shared/services/customer.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { NotifyService } from 'shared/utils/notify.service';
import { concat } from 'rxjs/internal/observable/concat';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CARE_ACTIVITY_STATUSES } from 'constants/care-activity';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import { CareActivityService } from 'shared/services/care-activity.service';
import { UserService } from 'shared/services/user.service';
import { User } from 'models/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ccm-create',
  templateUrl: './ccm-create.component.html',
  styleUrls: ['./ccm-create.component.scss'],
})
export class CcmCreateComponent implements OnInit {
  @ViewChild('GiftPrice')
  GiftPrice: ElementRef;
  public careActivity: CustomerCareActivity = new CustomerCareActivity();

  public CARE_ACTIVITY_STATUSES = CARE_ACTIVITY_STATUSES;
  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();
  public isLoadingCusotmer = false;

  public staffs: User[] = [];
  public isLoadingStaff = false;

  public isLoading = false;

  constructor(
    private _customerSv: CustomerService,
    private _emitter: EventEmitterService,
    private _notify: NotifyService,
    private _careActivitySv: CareActivityService,
    private _userSv: UserService,
  ) {}

  ngOnInit() {
    this.careActivity.customer = null;
    this.careActivity.status = null;
    this.careActivity.staff = null;
    this._initSearchCustomers();
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

  public onValueChange(event) {
    this.careActivity.date = event;
  }

  public createCareActivity(form: NgForm) {
    this.isLoading = true;

    this._careActivitySv.createCareActivity(this.careActivity.toJSON()).subscribe(
      (res) => {
        form.form.markAsPristine({ onlySelf: false });
        this._notify.success(res.meta.message);
        this._emitter.publishData({
          type: EMITTER_TYPE.CREATE_CARE_ACTIVITY,
        });
        this.isLoading = false;
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
      },
      () => {
        setTimeout(() => {
          this.careActivity = new CustomerCareActivity();
          this.careActivity.customer = null;
          this.careActivity.status = null;
          this.careActivity.staff = null;
        }, 0);
      },
    );
  }

  public changeGiftPrice() {
    if (isNaN(this.GiftPrice.nativeElement.value.toNumber())) {
      this.GiftPrice.nativeElement.value = this.careActivity.giftPrice;
      return;
    }
    this.careActivity.giftPrice = this.GiftPrice.nativeElement.value.toNumber().format();
  }
}
