import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Bts } from 'models/bts';
import { BtsService } from 'shared/services/bts.service';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { NgForm } from '@angular/forms';

// @ts-ignore-start
import {} from 'googlemaps';
// @ts-ignore-end

@Component({
  selector: 'app-bts-create',
  templateUrl: './bts-create.component.html',
  styleUrls: ['./bts-create.component.scss'],
})
export class BtsCreateComponent implements OnInit {
  @ViewChild('Address')
  private _address: ElementRef;

  public bts: Bts = new Bts();
  public isLoading = false;

  constructor(
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _btsSv: BtsService,
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

          this.bts.address = place.formatted_address;
          this.bts.latitude = place.geometry.location.lat();
          this.bts.longitude = place.geometry.location.lng();

          this._emitter.publishData({
            type: EMITTER_TYPE.GMAP_BTS_CREATE,
            data: this.bts.markerToJSON(),
          });
        });
      });
    });
  }

  public createBts(form: NgForm) {
    this.isLoading = true;

    this._btsSv.createBTS(this.bts.toJSON()).subscribe(
      (res) => {
        this._notify.success(res.meta.message);
        this._emitter.publishData({
          type: EMITTER_TYPE.CREATE_BTS,
        });
        this.isLoading = false;
        form.form.markAsPristine({ onlySelf: false });
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
      },
      () => {
        setTimeout(() => {
          this.bts = new Bts();
        }, 0);
      },
    );
  }
}
