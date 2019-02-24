import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import {} from 'googlemaps';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import * as pickBy from 'lodash/pickBy';
import { UploaderService } from 'shared/services/uploader.service';
import { BtsService } from 'shared/services/bts.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { RoleService } from 'app/role.service';

@Component({
  selector: 'app-bts-filter',
  templateUrl: './bts-filter.component.html',
  styleUrls: ['./bts-filter.component.scss'],
})
export class BtsFilterComponent implements OnInit {
  @ViewChild('Address')
  private _address: ElementRef;
  @ViewChild('FileUpload')
  private _fileUpload: ElementRef;

  public filterTerm = {
    siteCode: '',
    address: '',
    latitude: null,
    longitude: null,
  };

  private _mimeTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls',
    '.xlsx',
  ];

  public get accept_file(): string {
    return this._mimeTypes.toString();
  }

  public isLoading = false;

  constructor(
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _uploader: UploaderService,
    private _btsSv: BtsService,
    public role: RoleService,
  ) {}

  ngOnInit() {
    this._initAutoCompleteGmap();
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

          this.filterTerm.address = place.formatted_address;
          this.filterTerm.latitude = place.geometry.location.lat();
          this.filterTerm.longitude = place.geometry.location.lng();
        });
      });
    });
  }

  public filterBts() {
    const params = pickBy(this.filterTerm, (value, key) => {
      return ['siteCode', 'address', 'latitude', 'longitude'].indexOf(key) >= 0 && value;
    });

    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_BTS,
      params,
    });
  }

  public getFile() {
    const file = this._fileUpload.nativeElement.files[0];
    if (!file) {
      return;
    }

    // Validator File Type
    if (this._mimeTypes.indexOf(file.type) < 0) {
      this._notify.error('You can not upload files that are not in xls, xlsx format');
      return;
    }

    // Validator File Size
    if (file.size >= 10485760) {
      this._notify.error('You can not upload images larger than 10MB in size');
      return;
    }

    const data = [
      {
        key: 'file',
        value: file,
      },
    ];

    this.isLoading = true;

    this._uploader.store(`bts/import`, data).subscribe(
      (res) => {
        this.isLoading = false;
        if (res.data.done && res.data.done > 0) {
          this._notify.success(`import success ${res.data.done} rows`);
        }

        if (res.data.failed && res.data.failed > 0) {
          this._notify.error(`import failed ${res.data.failed} rows`);
        }

        if (res.data.duplicate && res.data.duplicate > 0) {
          this._notify.warning(`import duplicate ${res.data.duplicate} rows`);
        }

        this._emitter.publishData({
          type: EMITTER_TYPE.CREATE_BTS,
        });

        this._removeFile();
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
        this._removeFile();
      },
    );
  }

  private _removeFile() {
    this._fileUpload.nativeElement.value = null;
  }

  public exportBts() {
    const params: any = {};
    if (this.filterTerm.siteCode) {
      params.siteCode = this.filterTerm.siteCode.trim();
    }
    if (this.filterTerm.address) {
      params.address = this.filterTerm.address.trim();
    }
    if (this.filterTerm.latitude) {
      params.latitude = this.filterTerm.latitude;
    }
    if (this.filterTerm.longitude) {
      params.longitude = this.filterTerm.longitude;
    }

    this._btsSv.exportBts(params).subscribe(
      (res) => {
        saveAs(res, `bts-${moment().unix()}.xlsx`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
