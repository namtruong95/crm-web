import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { EMITTER_TYPE } from 'constants/emitter';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from 'models/user';
import { UserService } from 'shared/services/user.service';
import { Branch } from 'models/branch';
import { Township } from 'models/township';
import { BranchService } from 'shared/services/branch.service';
import { District } from 'models/district';
import { GmapService } from 'shared/services/gmap.service';
import { RoleService } from 'app/role.service';
import { RootScopeService } from 'app/services/root-scope.service';

@Component({
  selector: 'app-customer-modal-edit',
  templateUrl: './customer-modal-edit.component.html',
  styleUrls: ['./customer-modal-edit.component.scss'],
})
export class CustomerModalEditComponent implements OnInit, OnDestroy {
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
  private _isChangeLatLng = false;

  public get canChangeBranch(): boolean {
    return this._role.is_admin || this._role.is_sale_director || this._role.is_branch_director;
  }
  public get canChangeAssignedStaff(): boolean {
    return (
      this._role.is_hq_sale_staff ||
      this._role.is_branch_sale_staff ||
      (this._role.is_branch_director && this.customer.assignedBranchId === this._rootScope.currentUser.branchId)
    );
  }

  constructor(
    private _customerTypeSv: CustomerTypeService,
    private _customerClassificationSv: CustomerClassificationService,
    private _notify: NotifyService,
    private _customerSv: CustomerService,
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _emitter: EventEmitterService,
    private _userSv: UserService,
    private _branchSv: BranchService,
    private _gmapSv: GmapService,
    private _role: RoleService,
    private _rootScope: RootScopeService,
  ) {}

  ngOnInit() {
    this.customer.setEmpty();
    this._getCustomerTypes();
    this._getTypeOfSales();
    this._getTypeOfInvestment();
    this._getCatalog();
    this._onEventEmitter();
    this._getBranchList();
    if (this.customer.branchId) {
      this.getDistrictList(false);
    }
    if (this.customer.districtId) {
      this.getTownshipList(false);
    }
    if (!this.canChangeBranch) {
      this._getUsers();
    }
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && (data.type === EMITTER_TYPE.GMAP_CLICK || data.type === EMITTER_TYPE.GMAP_PLACE_CHANGED)) {
        if (data.data.mode === 'edit') {
          this.customer.latitude = data.data.lat;
          this.customer.longitude = data.data.lng;
        }

        return;
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
    this._gmapSv.findAddressWithLocation(data, (results, status) => {
      this._isChangeLatLng = false;

      if (status === 'OK') {
        if (results[0]) {
          // emit zoom to latlng
          this._emitter.publishData({
            type: EMITTER_TYPE.GMAP_ZOOM_TO,
            data: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
              zoom: 12,
            },
          });

          return;
        }
        this._notify.warning('No results found!');
      }
    });
  }

  public groupByFn = (item) => item.child.state;

  private _findAddressWithAddress(address: string, zoom: number) {
    this._gmapSv.findAddressWithAddress(address, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          // emit zoom to latlng
          this._emitter.publishData({
            type: EMITTER_TYPE.GMAP_ZOOM_TO,
            data: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
              zoom: zoom,
            },
          });

          return;
        }
        this._notify.warning('No results found!');
      }
    });
  }

  public getRegionAndZoomTo() {
    let address = '';

    const iState = this.branches.findIndex((item) => item.id === this.customer.branchId);
    if (iState >= 0) {
      address += `${this.branches[iState].name} State, Myanmar (Burma)`;
    }

    if (address) {
      this._findAddressWithAddress(address, 5);
    }
  }

  public getDistrictAndZoomTo() {
    let address = '';

    const iDistrict = this.districts.findIndex((item) => item.id === this.customer.districtId);
    if (iDistrict >= 0) {
      address += `${this.districts[iDistrict].name} District`;
    }

    const iState = this.branches.findIndex((item) => item.id === this.customer.branchId);
    if (iState >= 0) {
      address += `, ${this.branches[iState].name} State, Myanmar (Burma)`;
    }

    if (address) {
      this._findAddressWithAddress(address, 7);
    }
  }

  public getTownshipAndZoomTo() {
    let address = '';

    const iTownship = this.townships.findIndex((item) => item.id === this.customer.townshipId);
    if (iTownship >= 0) {
      address += `${this.townships[iTownship].name}`;
    }

    const iDistrict = this.districts.findIndex((item) => item.id === this.customer.districtId);
    if (iDistrict >= 0) {
      address += `, ${this.districts[iDistrict].name} District`;
    }

    const iState = this.branches.findIndex((item) => item.id === this.customer.branchId);
    if (iState >= 0) {
      address += `, ${this.branches[iState].name} State, Myanmar (Burma)`;
    }

    if (address) {
      this._findAddressWithAddress(address, 9);
    }
  }

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

  public getDistrictList(initLoad = true) {
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
        if (initLoad) {
          this.customer.districtId = null;
        }
        this.isLoadingDistrict = false;
      },
      (errors) => {
        this.isLoadingDistrict = false;
        this._notify.error(errors);
      },
    );
  }

  public getTownshipList(initLoad = true) {
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
        if (initLoad) {
          this.customer.townshipId = null;
        }
        this.isLoadingTownship = false;
      },
      (errors) => {
        this.isLoadingTownship = false;
        this._notify.error(errors);
      },
    );
  }

  private _getUsers(opts: any = {}) {
    this.isLoadingUser = true;

    this._userSv.getAllUsers(opts).subscribe(
      (res) => {
        this.users = res;
        this.isLoadingUser = false;

        if (!this.canChangeAssignedStaff && this.users.length > 0) {
          this.customer.assignedStaff = this.users[0];
          return;
        }
        this.customer.assignedStaff = null;
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
  public findUsers() {
    if (!this.canChangeBranch) {
      return;
    }

    const opts: any = {};

    if (this.customer.assignedBranchId) {
      opts.branchId = this.customer.assignedBranchId;
      opts.isBranchDirector = 1;
    }

    if (this._role.is_branch_director && this._rootScope.currentUser.branchId === this.customer.assignedBranchId) {
      opts.isBranchDirector = 0;
    }

    this._getUsers(opts);
  }
}
