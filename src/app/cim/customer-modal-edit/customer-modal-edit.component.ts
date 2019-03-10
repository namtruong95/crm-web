import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { Customer } from 'models/customer';
import { CustomerType } from 'models/customer-type';
import { CUSTOMER_STATUSES } from 'constants/customer-status';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import { CustomerClassification } from 'models/customer-classification';
import { CustomerTypeService } from 'shared/services/customer-type.service';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { NotifyService } from 'shared/utils/notify.service';
import { CustomerService } from 'shared/services/customer.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RegExp } from 'constants/reg-exp';
import { MapsAPILoader } from '@agm/core';
import { EMITTER_TYPE } from 'constants/emitter';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';
// @ts-ignore-start
import {} from 'googlemaps';
import { Branch } from 'models/branch';
import { Township } from 'models/township';
import { BranchService } from 'shared/services/branch.service';
import { District } from 'models/district';
// @ts-ignore-end
@Component({
  selector: 'app-customer-modal-edit',
  templateUrl: './customer-modal-edit.component.html',
  styleUrls: ['./customer-modal-edit.component.scss'],
})
export class CustomerModalEditComponent implements OnInit, OnDestroy {
  @ViewChild('AddressEdit')
  private _address: ElementRef;

  public customer: Customer = new Customer();

  // customer types
  public customerTypes: CustomerType[] = [];
  public isLoadingCustomerType = false;

  // customer status
  public CUSTOMER_STATUSES = CUSTOMER_STATUSES;

  // type of sale
  public typeOfSales: CustomerClassification[] = [];
  public isLoadingTypeOfSale = false;

  // catalog
  public catalogs: CustomerClassification[] = [];
  public isLoadingCatalog = false;

  // type of investment
  public typeOfInvestments: CustomerClassification[] = [];
  public isLoadingTypeOfInvestment = false;

  // users
  public users: User[] = [];
  public isLoadingUser = false;

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  // districts
  public districts: District[] = [];
  public isLoadingDistrict = false;

  // townships
  public townships: Township[] = [];
  public isLoadingTownship = false;

  // datepicker config
  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  public isLoading = false;
  public rules = RegExp;
  private _subscriber: Subscription;
  private _geocoder;
  private _isChangeLatLng = false;

  constructor(
    private _customerTypeSv: CustomerTypeService,
    private _customerClassificationSv: CustomerClassificationService,
    private _notify: NotifyService,
    private _customerSv: CustomerService,
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _emitter: EventEmitterService,
    private _userSv: UserService,
    private _branchSv: BranchService,
  ) {}

  ngOnInit() {
    this.customer.setEmpty();
    this._getCustomerTypes();
    this._getTypeOfSales();
    this._getTypeOfInvestment();
    this._getUsers();
    this._getCatalog();
    this._onEventEmitter();
    setTimeout(() => {
      this._initAutoCompleteGmap();
    }, 0);
    this._getBranchList();
    if (this.customer.branchId) {
      this.getDistrictList();
    }
    if (this.customer.districtId) {
      this.getTownshipList();
    }
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.GMAP_CLICK) {
        this.customer.latitude = data.data.lat;
        this.customer.longitude = data.data.lng;

        // get address with lat/long
        this._isChangeLatLng = true;
        this.findAddressWithLatLng();
      }
    });
  }

  public changeLatLng() {
    this._isChangeLatLng = true;
  }

  public findAddressWithLatLng() {
    if (!this.customer.latitude || !this.customer.longitude || !this._isChangeLatLng) {
      return;
    }

    if (
      !RegExp.latitude.test(this.customer.latitude.toString()) ||
      !RegExp.longitude.test(this.customer.longitude.toString())
    ) {
      this._notify.warning('latitude or longitude format is incorrect!');
      return;
    }

    // call api
    const data = {
      lat: this.customer.latitude,
      lng: this.customer.longitude,
    };
    if (!this._geocoder) {
      this._geocoder = new google.maps.Geocoder();
    }

    this._geocoder.geocode({ location: data }, (results, status) => {
      this._isChangeLatLng = false;

      if (status === 'OK') {
        if (results[0]) {
          this._emitter.publishData({
            type: EMITTER_TYPE.GMAP_CHANGE,
            data: results[0],
            mode: 'create',
          });

          this.customer.address = results[0].formatted_address;
        } else {
          this._notify.warning('No results found!');
        }
      }
    });
  }

  private _initAutoCompleteGmap() {
    this._mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this._address.nativeElement, {
        types: ['address'],
      });

      autocomplete.addListener('place_changed', () => {
        this._ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.customer.address = place.formatted_address;
          this.customer.latitude = place.geometry.location.lat();
          this.customer.longitude = place.geometry.location.lng();

          // emitter to gmap
          this._emitter.publishData({
            type: EMITTER_TYPE.GMAP_CHANGE,
            data: place,
            mode: 'edit',
          });
        });
      });
    });
  }

  public groupByFn = (item) => item.child.state;

  private _getBranchList() {
    this.isLoadingBranch = true;
    this._branchSv.getBranchList().subscribe(
      (res) => {
        this.branches = res.branches;
        this.isLoadingBranch = false;
      },
      (errors) => {
        this.isLoadingBranch = false;
        this._notify.error(errors);
      },
    );
  }

  public getDistrictList() {
    if (!this.customer.branchId) {
      this.districts = [];
      this.customer.districtId = null;
      return;
    }

    this.isLoadingDistrict = true;
    const opts = {
      branchId: this.customer.branchId,
    };

    this._branchSv.getDistrictList(opts).subscribe(
      (res) => {
        this.districts = res.districts;
        this.customer.districtId = null;
        this.isLoadingDistrict = false;
      },
      (errors) => {
        this.isLoadingDistrict = false;
        this._notify.error(errors);
      },
    );
  }

  public getTownshipList() {
    if (!this.customer.districtId) {
      this.townships = [];
      this.customer.townshipId = null;
      return;
    }

    this.isLoadingTownship = true;
    const opts = {
      districtId: this.customer.districtId,
      branchId: this.customer.branchId,
    };
    this._branchSv.getTownshipList(opts).subscribe(
      (res) => {
        this.townships = res.townships;
        this.customer.townshipId = null;
        this.isLoadingTownship = false;
      },
      (errors) => {
        this.isLoadingTownship = false;
        this._notify.error(errors);
      },
    );
  }

  private _getUsers() {
    this.isLoadingUser = true;

    this._userSv.getAllUsers().subscribe(
      (res) => {
        this.users = res;
        this.isLoadingUser = false;
      },
      (errors) => {
        this.isLoadingUser = false;
        this._notify.error(errors);
      },
    );
  }

  private _getCustomerTypes() {
    this.isLoadingCustomerType = true;

    this._customerTypeSv.customerTypesRead().subscribe(
      (res) => {
        this.isLoadingCustomerType = false;
        this.customerTypes = res;
      },
      (errors) => {
        this.isLoadingCustomerType = false;
        this._notify.error(errors);
      },
    );
  }

  private _getTypeOfSales() {
    this.isLoadingTypeOfSale = true;

    const params = {
      type: 'sale',
    };
    this.typeOfSales = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingTypeOfSale = false;
        this.typeOfSales = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingTypeOfSale = false;
        this._notify.error(errors);
      },
    );
  }

  private _getCatalog() {
    this.isLoadingCatalog = true;

    const params = {
      type: 'catalog',
    };
    this.typeOfSales = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingCatalog = false;
        this.catalogs = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingCatalog = false;
        this._notify.error(errors);
      },
    );
  }

  private _getTypeOfInvestment() {
    this.isLoadingTypeOfInvestment = true;

    const params = {
      type: 'investment',
    };
    this.typeOfInvestments = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingTypeOfInvestment = false;
        this.typeOfInvestments = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingTypeOfInvestment = false;
        this._notify.error(errors);
      },
    );
  }

  public onValueChange(event) {
    this.customer.customerDate = event;
  }

  public close(reason?: string) {
    this._modalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }

  public updateCustomer() {
    this.isLoading = true;
    this._customerSv.updateCustomer(this.customer.id, this.customer.toJSON()).subscribe(
      (res) => {
        this.isLoading = true;
        this._notify.success('update customer success');
        this.close('reload');
      },
      (errors) => {
        this._notify.error(errors);
        this.isLoading = true;
      },
    );
  }
}
