import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Marker } from 'interfaces/maker';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { Subscription } from 'rxjs/Subscription';
import { GMAP_DEFAULT } from 'constants/gmap';

@Component({
  selector: 'app-bts-map',
  templateUrl: './bts-map.component.html',
  styleUrls: ['./bts-map.component.scss'],
})
export class BtsMapComponent implements OnInit, OnDestroy {
  public lat = GMAP_DEFAULT.LAT;
  public lng = GMAP_DEFAULT.LNG;
  public zoom = GMAP_DEFAULT.ZOOM;

  private _markers: Marker[] = [];
  private _createMarker: Marker[] = [];
  public get markers(): Marker[] {
    return [].concat(this._markers, this._createMarker);
  }

  private _subscriber: Subscription;

  constructor(private _emitter: EventEmitterService) {}

  ngOnInit() {
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
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
    });
  }
}
