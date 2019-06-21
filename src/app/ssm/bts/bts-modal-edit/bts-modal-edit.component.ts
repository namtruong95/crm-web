import { Component, OnInit, OnDestroy } from '@angular/core';
import { Bts } from 'models/bts';

import { NotifyService } from 'shared/utils/notify.service';
import { BtsService } from 'shared/services/bts.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Branch } from 'models/branch';
import { District } from 'models/district';
import { Township } from 'models/township';
import { BranchService } from 'shared/services/branch.service';
import { Subscription } from 'rxjs/Subscription';
import { GmapService } from 'shared/services/gmap.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { RegExp } from 'constants/reg-exp';

@Component({
  selector: 'app-bts-modal-edit',
  templateUrl: './bts-modal-edit.component.html',
  styleUrls: ['./bts-modal-edit.component.scss'],
})
export class BtsModalEditComponent implements OnInit, OnDestroy {
  public bts: Bts;
  public isLoading = false;

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  // districts
  public districts: District[] = [];
  public isLoadingDistrict = false;

  // townships
  public townships: Township[] = [];
  public isLoadingTownship = false;

  private _subscriber: Subscription;
  private _isChangeLatLng = false;

  constructor(
    private _notify: NotifyService,
    private _btsSv: BtsService,
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _branchSv: BranchService,
    private _gmapSv: GmapService,
    private _emitter: EventEmitterService,
  ) {}

  ngOnInit() {
    this._getBranchList();
    if (this.bts.branchId) {
      this.getDistrictList(false);
    }
    if (this.bts.districtId) {
      this.getTownshipList(false);
    }

    this._onEventEmitter();
  }

  ngOnDestroy() {
    if (this._subscriber) {
      this._subscriber.unsubscribe();
    }
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && (data.type === EMITTER_TYPE.GMAP_CLICK || data.type === EMITTER_TYPE.GMAP_PLACE_CHANGED)) {
        if (data.data.mode === 'edit') {
          this.bts.latitude = data.data.lat;
          this.bts.longitude = data.data.lng;
        }
      }
    });
  }

  public changeLatLng() {
    this._isChangeLatLng = true;
  }

  public findAddressWithLatLng() {
    if (!this.bts.latitude || !this.bts.longitude || !this._isChangeLatLng) {
      return;
    }

    if (!RegExp.latitude.test(this.bts.latitude.toString()) || !RegExp.longitude.test(this.bts.longitude.toString())) {
      this._notify.warning('latitude or longitude format is incorrect!');
      return;
    }

    // call api
    const data = {
      lat: this.bts.latitude,
      lng: this.bts.longitude,
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

    const iState = this.branches.findIndex((item) => item.id === this.bts.branchId);
    if (iState >= 0) {
      address += `${this.branches[iState].name} State, Myanmar (Burma)`;
    }

    if (address) {
      this._findAddressWithAddress(address, 5);
    }
  }

  public getDistrictAndZoomTo() {
    let address = '';

    const iDistrict = this.districts.findIndex((item) => item.id === this.bts.districtId);
    if (iDistrict >= 0) {
      address += `${this.districts[iDistrict].name} District`;
    }

    const iState = this.branches.findIndex((item) => item.id === this.bts.branchId);
    if (iState >= 0) {
      address += `, ${this.branches[iState].name} State, Myanmar (Burma)`;
    }

    if (address) {
      this._findAddressWithAddress(address, 7);
    }
  }

  public getTownshipAndZoomTo() {
    let address = '';

    const iTownship = this.townships.findIndex((item) => item.id === this.bts.townshipId);
    if (iTownship >= 0) {
      address += `${this.townships[iTownship].name}`;
    }

    const iDistrict = this.districts.findIndex((item) => item.id === this.bts.districtId);
    if (iDistrict >= 0) {
      address += `, ${this.districts[iDistrict].name} District`;
    }

    const iState = this.branches.findIndex((item) => item.id === this.bts.branchId);
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
    if (!this.bts.branchId) {
      this.districts = [];
      this.bts.districtId = null;
      return;
    }
    this.isLoadingDistrict = true;
    const opts = {
      branchId: this.bts.branchId,
    };

    this._branchSv.getDistrictList(opts).subscribe(
      (res) => {
        this.districts = res.districts;
        if (initLoad) {
          this.bts.districtId = null;
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
    if (!this.bts.districtId) {
      this.townships = [];
      this.bts.townshipId = null;
      return;
    }
    this.isLoadingTownship = true;
    const opts = {
      districtId: this.bts.districtId,
      branchId: this.bts.branchId,
    };
    this._branchSv.getTownshipList(opts).subscribe(
      (res) => {
        this.townships = res.townships;

        if (initLoad) {
          this.bts.townshipId = null;
        }
        this.isLoadingTownship = false;
      },
      (errors) => {
        this.isLoadingTownship = false;
        this._notify.error(errors);
      },
    );
  }

  public updateBts() {
    this.isLoading = true;

    this._btsSv.updateBTS(this.bts.id, this.bts.toJSON()).subscribe(
      (res) => {
        this._notify.success('updated BTS success');
        this.bts = new Bts();
        this.isLoading = false;
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
}
