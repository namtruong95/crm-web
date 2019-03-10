import { Component, OnInit } from '@angular/core';
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
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { SaleActivity } from 'models/sale-activity';
import { CustomerClassification } from 'models/customer-classification';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { SaleActivityService } from 'shared/services/sale-activity.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-timeline-modal-edit',
  templateUrl: './timeline-modal-edit.component.html',
  styleUrls: ['./timeline-modal-edit.component.scss'],
})
export class TimelineModalEditComponent implements OnInit {
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
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
  ) {}

  ngOnInit() {
    this._initSearchCustomers();
    this._getStaffs();
    this._statusOfProcess();
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

  public updateSareActivity() {
    this.isLoading = true;

    this._saleActivitySv.updateSaleActivity(this.saleActivity.id, this.saleActivity.toJSON()).subscribe(
      (res) => {
        this.close('reload');
        this.isLoading = false;
      },
      (errors) => {
        this._notify.error(errors);
        this.isLoading = false;
      },
    );
  }

  public close(reason?: string) {
    this._modalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }
}
