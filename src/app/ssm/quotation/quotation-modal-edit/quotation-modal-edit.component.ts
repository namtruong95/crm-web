import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Customer } from 'models/customer';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/internal/observable/of';
import { concat } from 'rxjs/internal/observable/concat';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CustomerService } from 'shared/services/customer.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { Quotation } from 'models/quotation';
import { NotifyService } from 'shared/utils/notify.service';
import { GmapService, GmapParams } from 'shared/services/gmap.service';
import { Helpers } from 'shared/helpers/helpers';
import { CustomerClassification } from 'models/customer-classification';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { BtsService } from 'shared/services/bts.service';
import { Bts } from 'models/bts';
import { Marker } from 'interfaces/maker';
import { QuotationService } from 'shared/services/quotation.service';
import { PolicyService } from 'shared/services/policy.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'shared/services/user.service';
import { User } from 'models/user';

@Component({
  selector: 'app-quotation-modal-edit',
  templateUrl: './quotation-modal-edit.component.html',
  styleUrls: ['./quotation-modal-edit.component.scss'],
})
export class QuotationModalEditComponent implements OnInit {
  @ViewChild('ReduceMRC')
  ReduceMRC: ElementRef;
  @ViewChild('ReduceOTC')
  ReduceOTC: ElementRef;
  @ViewChild('OTC')
  OTC: ElementRef;
  @ViewChild('MRC')
  MRC: ElementRef;

  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();
  public isLoadingCusotmer = false;

  public quotation: Quotation;
  // type of serivice
  public isLoadingTypeOfService = false;
  public typeOfServices: CustomerClassification[] = [];

  // service term
  public isLoadingServiceTerm = false;
  public serviceTerms: CustomerClassification[] = [];

  // sale staffs
  public staffs: User[] = [];
  public isLoadingStaff = false;

  public isLoadingBts = false;
  public btsList: Bts[] = [];
  public get btsMakers(): Marker[] {
    return this.btsList.map((bts) => {
      return bts.markerToJSON();
    });
  }
  public isLoading = false;
  public minMaxMrc: string;

  constructor(
    private _customerSv: CustomerService,
    private _emitter: EventEmitterService,
    private _gmapSv: GmapService,
    private _notify: NotifyService,
    private _customerClassificationSv: CustomerClassificationService,
    private _btsSv: BtsService,
    private _quotationSv: QuotationService,
    private _policySv: PolicyService,
    private _userSv: UserService,
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
  ) {}

  ngOnInit() {
    this._searchCustomers();
    this._getServicesterm();
    this._getTypeOfServices();
    this._getAllBts();
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

  private _getAllBts() {
    this.isLoadingBts = true;
    this._btsSv.getAllBts().subscribe(
      (res) => {
        this.btsList = res.btsList;
        this.isLoadingBts = false;
      },
      (errors) => {
        this._notify.error(errors);
        this.isLoadingBts = false;
      },
    );
  }

  private _getServicesterm() {
    this.isLoadingServiceTerm = true;

    const params = {
      type: 'service',
    };
    this.serviceTerms = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingServiceTerm = false;
        this.serviceTerms = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingServiceTerm = false;
        this._notify.error(errors);
      },
    );
  }

  private _getTypeOfServices() {
    this.isLoadingTypeOfService = true;

    const params = {
      type: 'service-term',
    };
    this.typeOfServices = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingTypeOfService = false;
        this.typeOfServices = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingTypeOfService = false;
        this._notify.error(errors);
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
            .searchCustomers({
              page: 0,
              size: 100,
              sort: 'asc',
              column: 'id',
              txtSearch: term,
            })
            .pipe(
              catchError(() => of([])), // empty list on error
              tap(() => (this.isLoadingCusotmer = false)),
            ),
        ),
      ),
    );
  }

  public changeCusotmer() {
    if (!this.quotation.customer || !this.quotation.customer.has_address) {
      this._notify.warning('please select customer or change location for cusotmer');
      return;
    }

    if (this.btsList.length === 0) {
      this._notify.warning('bts not found');
      return;
    }
    const params: GmapParams = {
      origins: [Helpers.origins(this.quotation.customer.gmapToJSON())],
      destinations: Helpers.destinations(this.btsMakers),
    };

    this._gmapSv.matrixDistance(params, (res, status) => {
      if (status === 'OK') {
        let min: any = null;

        if (res.rows.length > 0) {
          res.rows[0].elements.forEach((value, key) => {
            if (value.status === 'OK' && (!min || value.distance.value < min.value)) {
              min = {
                ...value.distance,
                key,
              };
            }
          });
        }

        if (min) {
          this.quotation.distance = Math.round((min.value / 1000) * 10) / 10;
          this._emitter.publishData({
            type: EMITTER_TYPE.GMAP_DISTANCE,
            mode: 'create',
            data: [
              {
                ...this.quotation.customer.gmapToJSON(),
                label: this.quotation.customer.address,
                iconUrl: 'https://png.icons8.com/office/30/000000/administrator-male.png',
              },
              this.btsList[min.key].markerToJSON(),
            ],
          });
        } else {
          this._notify.warning('data not found');
          this.quotation.distance = 0;
          this._emitter.publishData({
            type: EMITTER_TYPE.GMAP_DISTANCE,
            mode: 'create',
            data: [],
          });
        }

        setTimeout(() => {
          this.filterPolicies();
        }, 0);
      }
    });
  }

  public filterPolicies() {
    if (!this.quotation.canFilterPolicy) {
      return;
    }

    this._policySv.findPolicy(this.quotation.findPolicyToJSON()).subscribe(
      (res) => {
        if (res) {
          this.quotation.mrc = (+res.mrcMin).format();
          this.quotation.otc = (+res.otc).format();
          this.minMaxMrc = `(min=${(+res.mrcMin).format()}; max=${(+res.mrcMax).format()})`;
        } else {
          this.minMaxMrc = '';
        }
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

  // public changeReduceOtc(event) {
  //   if (event > 100) {
  //     this.quotation.reduceOtc = 100;
  //     this.ReduceOTC.nativeElement.value = this.quotation.reduceOtc;
  //     return;
  //   }
  //   if (event < 0) {
  //     this.quotation.reduceOtc = 0;
  //     this.ReduceOTC.nativeElement.value = this.quotation.reduceOtc;
  //     return;
  //   }

  //   this.quotation.reduceOtc = event;
  // }

  // public changeReduceMrc(event) {
  //   if (event > 100) {
  //     this.quotation.reduceMrc = 100;
  //     this.ReduceMRC.nativeElement.value = this.quotation.reduceMrc;
  //     return;
  //   }
  //   if (event < 0) {
  //     this.quotation.reduceMrc = 0;
  //     this.ReduceMRC.nativeElement.value = this.quotation.reduceMrc;
  //     return;
  //   }

  //   this.quotation.reduceMrc = event;
  // }

  public updateQuotation() {
    this.isLoading = true;

    this._quotationSv.updateQuotation(this.quotation.id, this.quotation.toJSON()).subscribe(
      (res) => {
        this.isLoading = false;
        this._notify.success('update quotation success');
        this.close('reload');
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

  public compareWithFn = (a, b) => {
    return a.fullName === b.fullName;
  };

  public changeOtc() {
    if (isNaN(this.OTC.nativeElement.value.toNumber()) || this.OTC.nativeElement.value.toNumber() < 0) {
      this.OTC.nativeElement.value = this.quotation.otc;
      return;
    }
    this.quotation.otc = this.OTC.nativeElement.value.toNumber().format();
  }

  public changeMrc() {
    if (isNaN(this.MRC.nativeElement.value.toNumber()) || this.MRC.nativeElement.value.toNumber() < 0) {
      this.MRC.nativeElement.value = this.quotation.mrc;
      return;
    }
    this.quotation.mrc = this.MRC.nativeElement.value.toNumber().format();
  }
}
