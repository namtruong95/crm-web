import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Marker } from 'interfaces/maker';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { Subscription } from 'rxjs/Subscription';
import { GMAP_DEFAULT } from 'constants/gmap';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-bts-map',
  templateUrl: './bts-map.component.html',
  styleUrls: ['./bts-map.component.scss'],
})
export class BtsMapComponent implements OnInit, OnDestroy {
  @ViewChild('Address')
  private _address: ElementRef;

  @Input('mode')
  private mode: string;

  private _lat: number;
  @Input('lat')
  public get lat(): number {
    return this._lat || GMAP_DEFAULT.LAT;
  }
  public set lat(v: number) {
    this._lat = v;
  }

  private _lng: number;
  @Input('lng')
  public get lng(): number {
    return this._lng || GMAP_DEFAULT.LNG;
  }

  public set lng(v: number) {
    this._lng = v;
  }

  private _label: string;
  @Input('label')
  public get label(): string {
    return this.lat !== GMAP_DEFAULT.LAT && this.lng !== GMAP_DEFAULT.LNG && this._label
      ? this._label
      : 'Yangon, Myanmar (Burma)';
  }
  public set label(v: string) {
    this._label = v;
  }

  public zoom = GMAP_DEFAULT.ZOOM;

  private _markers: Marker[] = [];
  private _createMarker: Marker[] = [];
  public get markers(): Marker[] {
    return [].concat(this._markers, this._createMarker);
  }

  private _subscriber: Subscription;

  constructor(private _emitter: EventEmitterService, private _mapsAPILoader: MapsAPILoader, private _ngZone: NgZone) {}

  ngOnInit() {
    this._onEventEmitter();
    this._initAutoCompleteGmap();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
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

          this._markers = [
            {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              draggable: false,
              label: place.formatted_address,
              iconUrl: 'https://png.icons8.com/nolan/30/000000/radio-tower.png',
            },
          ];

          // emit lat/lon
          this._emitter.publishData({
            type: EMITTER_TYPE.GMAP_PLACE_CHANGED,
            data: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              mode: this.mode,
            },
          });
        });
      });
    });
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.GMAP_BTS) {
        this._markers = data.data;
        this._createMarker = [];
      }

      if (data && data.type === EMITTER_TYPE.GMAP_BTS_CREATE) {
        if (data.data) {
          this._createMarker = [data.data];
          this.lat = data.data.lat;
          this.lng = data.data.lng;
        }
      }

      if (data && data.type === EMITTER_TYPE.GMAP_ZOOM_TO) {
        this.lat = data.data.lat;
        this.lng = data.data.lng;
        this.zoom = data.data.zoom;
      }
    });
  }

  public mapClicked($event: any) {
    this._markers = [
      {
        lat: $event.coords.lat,
        lng: $event.coords.lng,
        draggable: false,
        iconUrl: 'https://png.icons8.com/nolan/30/000000/radio-tower.png',
      },
    ];

    this._emitter.publishData({
      type: EMITTER_TYPE.GMAP_CLICK,
      data: {
        lat: $event.coords.lat,
        lng: $event.coords.lng,
        mode: this.mode,
      },
    });
  }
}
