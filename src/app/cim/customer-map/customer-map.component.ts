import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EMITTER_TYPE } from 'constants/emitter';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { Subscription } from 'rxjs/Subscription';
import { Marker } from 'interfaces/maker';
import { GMAP_DEFAULT } from 'constants/gmap';

@Component({
  selector: 'app-customer-map',
  templateUrl: './customer-map.component.html',
  styleUrls: ['./customer-map.component.scss'],
})
export class CustomerMapComponent implements OnInit, OnDestroy {
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

  constructor(private _emitter: EventEmitterService) {}

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
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.GMAP_CHANGE) {
        this.lat = data.data.geometry.location.lat();
        this.lng = data.data.geometry.location.lng();
        this.zoom = 12;
        this.markers = [
          {
            lat: data.data.geometry.location.lat(),
            lng: data.data.geometry.location.lng(),
            label: data.data.formatted_address,
            draggable: false,
            iconUrl: 'https://png.icons8.com/office/30/000000/administrator-male.png',
          },
        ];
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
      },
    });
  }

  public markerDragEnd(m: Marker, $event: MouseEvent) {
    // console.log('dragEnd', m, $event);
  }
}
