import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Bts } from 'models/bts';
import { MapsAPILoader } from '@agm/core';
import { NotifyService } from 'shared/utils/notify.service';
import { BtsService } from 'shared/services/bts.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Branch } from 'models/branch';
import { District } from 'models/district';
import { Township } from 'models/township';
import { BranchService } from 'shared/services/branch.service';

@Component({
  selector: 'app-bts-modal-edit',
  templateUrl: './bts-modal-edit.component.html',
  styleUrls: ['./bts-modal-edit.component.scss'],
})
export class BtsModalEditComponent implements OnInit {
  @ViewChild('Address')
  private _address: ElementRef;

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

  constructor(
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _notify: NotifyService,
    private _btsSv: BtsService,
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _branchSv: BranchService,
  ) {}

  ngOnInit() {
    this._initAutoCompleteGmap();

    this._getBranchList();
    if (this.bts.branchId) {
      this.getDistrictList();
    }
    if (this.bts.districtId) {
      this.getTownshipList();
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

  public getDistrictList() {
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
        this.isLoadingDistrict = false;
      },
      (errors) => {
        this.isLoadingDistrict = false;
        this._notify.error(errors);
      },
    );
  }

  public getTownshipList() {
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
        this.isLoadingTownship = false;
      },
      (errors) => {
        this.isLoadingTownship = false;
        this._notify.error(errors);
      },
    );
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

          this.bts.address = place.formatted_address;
          this.bts.latitude = place.geometry.location.lat();
          this.bts.longitude = place.geometry.location.lng();
        });
      });
    });
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
