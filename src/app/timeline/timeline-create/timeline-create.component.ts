import { Component, OnInit } from '@angular/core';
import { SaleActivity } from 'models/sale-activity';
import { Observable } from 'rxjs/Observable';
import { Customer } from 'models/customer';
import { of } from 'rxjs/internal/observable/of';
import { concat } from 'rxjs/internal/observable/concat';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CustomerService } from 'shared/services/customer.service';
import { Subject } from 'rxjs/Subject';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';
import { NotifyService } from 'shared/utils/notify.service';
import { CustomerClassification } from 'models/customer-classification';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import { SaleActivityService } from 'shared/services/sale-activity.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RoleService } from 'app/role.service';

@Component({
  selector: 'app-timeline-create',
  templateUrl: './timeline-create.component.html',
  styleUrls: ['./timeline-create.component.scss'],
})
export class TimelineCreateComponent implements OnInit {
  public isLoading = false;

  public saleActivity: SaleActivity = new SaleActivity();

  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();
  public isLoadingCusotmer = false;

  public staffs: User[] = [];
  public isLoadingStaff = false;

  // type of contact
  public isLoadingstatusOfProcess = false;
  public statusOfProcesses: CustomerClassification[] = [];

  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  constructor(
    private _customerSv: CustomerService,
    private _userSv: UserService,
    private _notify: NotifyService,
    private _customerClassificationSv: CustomerClassificationService,
    private _saleActivitySv: SaleActivityService,
    private _emitter: EventEmitterService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _role: RoleService,
  ) {}

  ngOnInit() {
    this._getStaffs();
    this._statusOfProcess();

    this._route.queryParams.subscribe((params) => {
      if (params.customerId && !isNaN(+params.customerId)) {
        this._showCustomer(+params.customerId);
        this._router.navigate(['/cim/timeline/create'], { replaceUrl: true });
        return;
      }

      this._initSearchCustomers();
    });
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

  private _showCustomer(id: number) {
    this._customerSv.showCustomer(id).subscribe((res) => {
      if (res) {
        this.saleActivity.customer = res;
        this._searchCustomers([res]);
      }
    });
  }

  private _searchCustomers(data?: Customer[]) {
    this.customers = concat(
      of(data || []), // default items
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

  private _getStaffs(opts: any = {}) {
    this.isLoadingStaff = true;

    this._userSv.getAllUsers(opts).subscribe(
      (res) => {
        this.staffs = res;

        const index = this.staffs.findIndex(
          (item) => this.saleActivity.assignedStaff && item.id === this.saleActivity.assignedStaff.id,
        );

        if (index < 0) {
          this.saleActivity.assignedStaff = null;
        }
        this.isLoadingStaff = false;
      },
      (errors) => {
        this.isLoadingStaff = false;
        this._notify.error(errors);
      },
    );
  }

  public onValueChange(event) {
    this.saleActivity.saleDate = event;
  }

  private _statusOfProcess() {
    this.isLoadingstatusOfProcess = true;

    const params = {
      type: 'contact',
    };
    this.statusOfProcesses = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingstatusOfProcess = false;
        this.statusOfProcesses = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingstatusOfProcess = false;
        this._notify.error(errors);
      },
    );
  }

  public createSaleActivity(form: NgForm) {
    this.isLoading = true;

    this._saleActivitySv.createSaleActivity(this.saleActivity.toJSON()).subscribe(
      (res) => {
        this._notify.success(res.meta.message);
        this._emitter.publishData({
          type: EMITTER_TYPE.CREATE_SALE_ACTIVITY_2,
        });
        this.isLoading = false;
        form.form.markAsPristine({ onlySelf: false });
      },
      (errors) => {
        this._notify.error(errors);
        this.isLoading = false;
      },
      () => {
        setTimeout(() => {
          this.saleActivity = new SaleActivity();
        }, 0);
      },
    );
  }

  public changeCustomer() {
    if (!this._role.is_admin) {
      return;
    }
    const opts: any = {};
    if (this.saleActivity.customer) {
      opts.branchId = this.saleActivity.customer.assignedBranchId;
    }
    this._getStaffs(opts);
  }
}
