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

import {} from 'googlemaps';
import { Subscription } from 'rxjs/Subscription';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';

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

  // type of contact
  // public isLoadingTypeOfContact = false;
  // public typeOfContacts: CustomerClassification[] = [];

  // users
  public users: User[] = [];
  public isLoadingUser = false;

  // datepicker config
  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  public isLoading = false;
  public rules = RegExp;
  private _subscriber: Subscription;

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
  ) {}

  ngOnInit() {
    this._getCustomerTypes();
    this._getTypeOfSales();
    this._getTypeOfInvestment();
    // this._typeOfContact();
    this._getUsers();
    this._getCatalog();
    setTimeout(() => {
      this._initAutoCompleteGmap();
    }, 0);
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.GMAP_CLICK) {
        this.customer.latitude = data.data.lat;
        this.customer.longitude = data.data.lng;
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

  // private _typeOfContact() {
  //   this.isLoadingTypeOfContact = true;

  //   const params = {
  //     type: 'contact',
  //   };
  //   this.typeOfInvestments = [];

  //   this._customerClassificationSv.getCustomerClassification(params).subscribe(
  //     (res) => {
  //       this.isLoadingTypeOfContact = false;
  //       this.typeOfContacts = res.customerClassifications;
  //     },
  //     (errors) => {
  //       this.isLoadingTypeOfContact = false;
  //       this._notify.error(errors);
  //     },
  //   );
  // }

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
