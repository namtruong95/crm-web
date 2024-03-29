import { Component, OnInit } from '@angular/core';
import { CustomerCareActivity } from 'models/customer-care-activity';
import { Observable } from 'rxjs/Observable';
import { Customer } from 'models/customer';
import { of } from 'rxjs/internal/observable/of';
import { Subject } from 'rxjs/Subject';
import { CustomerService } from 'shared/services/customer.service';
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';
import { RoleService } from 'app/role.service';

@Component({
  selector: 'app-ccm-modal-edit',
  templateUrl: './ccm-modal-edit.component.html',
  styleUrls: ['./ccm-modal-edit.component.scss'],
})
export class CcmModalEditComponent implements OnInit {
  @ViewChild('GiftPrice')
  GiftPrice: ElementRef;

  public careActivity: CustomerCareActivity;

  public CARE_ACTIVITY_STATUSES = CARE_ACTIVITY_STATUSES;
  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();
  public isLoadingCusotmer = false;

  public isLoading = false;
  public staffs: User[] = [];
  public isLoadingStaff = false;

  constructor(
    private _customerSv: CustomerService,
    private _notify: NotifyService,
    private _careActivitySv: CareActivityService,
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _userSv: UserService,
    private _role: RoleService,
  ) {}

  ngOnInit() {
    this._initSearchCustomers();
    this._getStaffs();
  }

  private _getStaffs(opts: any = {}) {
    this.isLoadingStaff = true;

    this._userSv.getAllUsersInBranch(opts).subscribe(
      (res) => {
        this.staffs = res;
        const index = this.staffs.findIndex(
          (item) => this.careActivity.assignedStaff && item.id === this.careActivity.assignedStaff.id,
        );

        if (index < 0) {
          this.careActivity.assignedStaff = null;
        }

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

  public onValueChange(event) {
    this.careActivity.date = event;
  }

  public close(reason?: string) {
    this._modalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }

  public updateCareActivity() {
    this.isLoading = true;
    this._careActivitySv.updateCareActivity(this.careActivity.id, this.careActivity.toJSON()).subscribe(
      (res) => {
        this.isLoading = false;
        this._notify.success('update care activity success');
        this.close('reload');
      },
      (errors) => {
        this._notify.error(errors);
        this.isLoading = false;
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

  public changeCustomer() {
    if (!this._role.is_admin) {
      return;
    }
    const opts: any = {};
    if (this.careActivity.customer) {
      opts.branchId = this.careActivity.customer.assignedBranchId;
    }
    this._getStaffs(opts);
  }
}
