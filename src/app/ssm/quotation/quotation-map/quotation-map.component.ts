import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Marker } from 'interfaces/maker';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd } from '@angular/router';
import { GMAP_DEFAULT } from 'constants/gmap';

@Component({
  selector: 'app-quotation-map',
  templateUrl: './quotation-map.component.html',
  styleUrls: ['./quotation-map.component.scss'],
})
export class QuotationMapComponent implements OnInit, OnDestroy {
  @Input('markersInput')
  markersInput: Marker[];
  public lat = GMAP_DEFAULT.LAT;
  public lng = GMAP_DEFAULT.LNG;
  public zoom = 12;

  public markers: Marker[] = [];
  private _subscriber: Subscription;
  private _subscriberRouter: Subscription;

  constructor(private _emitter: EventEmitterService, private _router: Router) {}

  ngOnInit() {
    if (this.markersInput && this.markersInput.length > 0) {
      this.markers = this.markersInput;
      this.lat = this.markersInput[0].lat;
      this.lng = this.markersInput[0].lng;
    }

    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
    this._subscriberRouter.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.GMAP_DISTANCE) {
        this.markers = data.data;
        if (data.data && data.data.length > 0) {
          this.lat = data.data[0].lat || GMAP_DEFAULT.LAT;
          this.lng = data.data[0].lng || GMAP_DEFAULT.LNG;
        } else {
          this.lat = GMAP_DEFAULT.LAT;
          this.lng = GMAP_DEFAULT.LNG;
        }
      }

      if (data && data.type === EMITTER_TYPE.CHANGE_CUSTOMER_QUOTATION) {
        if (data.data) {
          this.lat = data.data.lat;
          this.lng = data.data.lng;
          this.markers = [data.data];
        }
      }
    });

    this._subscriberRouter = this._router.events.subscribe((res) => {
      if (res instanceof NavigationEnd) {
        this.lat = GMAP_DEFAULT.LAT;
        this.lng = GMAP_DEFAULT.LNG;
        this.markers = [];
      }
    });
  }
}
