import { Marker } from 'interfaces/maker';
import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface BtsInterface extends BaseModelInterface {
  siteCode: string;
  address: string;
  state: string;
  townShip: string;
  longitude: number;
  latitude: number;
}

export class Bts extends BaseModel implements Deserializable<Bts> {
  siteCode: string;
  address: string;
  state: string;
  townShip: string;
  longitude: number;
  latitude: number;

  constructor() {
    super();
  }

  deserialize(input: Partial<BtsInterface>): Bts {
    super.deserialize(input);
    Object.assign(this, input);
    return this;
  }

  public toJSON() {
    return {
      state: this.state || null,
      siteCode: this.siteCode || null,
      address: this.address || null,
      townShip: this.townShip || null,
      latitude: this.latitude || null,
      longitude: this.longitude || null,
    };
  }

  public markerToJSON(): Marker {
    return {
      label: this.address,
      lat: this.latitude,
      lng: this.longitude,
      iconUrl: 'https://png.icons8.com/nolan/30/000000/radio-tower.png',
    };
  }
}
