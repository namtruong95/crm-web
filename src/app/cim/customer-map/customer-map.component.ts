import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { EMITTER_TYPE } from 'constants/emitter';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { Subscription } from 'rxjs/Subscription';
import { Marker } from 'interfaces/maker';
import { GMAP_DEFAULT } from 'constants/gmap';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-customer-map',
  templateUrl: './customer-map.component.html',
  styleUrls: ['./customer-map.component.scss'],
})
export class CustomerMapComponent implements OnInit, OnDestroy {
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

  // google maps zoom level
  public zoom = 11;

  public markers: Marker[] = [];

  private _subscriber: Subscription;

  constructor(private _emitter: EventEmitterService, private _mapsAPILoader: MapsAPILoader, private _ngZone: NgZone) {}

  ngOnInit() {
    this.markers = [
      {
        lat: this.lat,
        lng: this.lng,
        label: this.label,
        draggable: false,
        iconUrl: 'https://png.icons8.com/office/30/000000/administrator-male.png',
      },
    ];
    this._onEventEmitter();
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

          this.markers = [
            {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              draggable: false,
              label: place.formatted_address,
              iconUrl: 'https://png.icons8.com/office/30/000000/administrator-male.png',
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

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.GMAP_ZOOM_TO) {
        this.lat = data.data.lat;
        this.lng = data.data.lng;
        this.zoom = data.data.zoom;
      }
    });
  }

  public clickedMarker(mark: any, index: number) {
    // console.log(`clicked the marker: `, mark);
  }

  public mapClicked($event: any) {
    this.markers = [
      {
        lat: $event.coords.lat,
        lng: $event.coords.lng,
        draggable: false,
        iconUrl: 'https://png.icons8.com/office/30/000000/administrator-male.png',
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

  public markerDragEnd(m: Marker, $event: MouseEvent) {
    // console.log('dragEnd', m, $event);
  }
}
