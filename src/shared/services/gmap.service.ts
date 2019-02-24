import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

export interface GmapParams {
  origins: string[];
  destinations: string[];
}

@Injectable()
export class GmapService {
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
}
