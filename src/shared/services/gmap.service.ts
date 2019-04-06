import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
// @ts-ignore-start
import {} from 'googlemaps';

export interface GmapParams {
  origins: string[];
  destinations: string[];
}

@Injectable()
export class GmapService {
  private _geocoder;

  constructor(private _mapsAPILoader: MapsAPILoader) {}

  public matrixDistance(params: GmapParams, callback) {
    this._mapsAPILoader.load().then(() => {
      const service = new google.maps.DistanceMatrixService();

      service.getDistanceMatrix(
        {
          origins: params.origins,
          destinations: params.destinations,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        callback,
      );
    });
  }

  public findAddressWithLocation(data: { lat: number; lng: number }, callback) {
    if (!this._geocoder) {
      this._geocoder = new google.maps.Geocoder();
    }

    this._geocoder.geocode({ location: data }, callback);
  }

  public findAddressWithAddress(data: string, callback) {
    if (!this._geocoder) {
      this._geocoder = new google.maps.Geocoder();
    }

    this._geocoder.geocode({ address: data }, callback);
  }
}
