import { Marker } from 'interfaces/maker';
import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';
import { Branch } from './branch';
import { District } from './district';
import { Township } from './township';

interface BtsInterface extends BaseModelInterface {
  siteCode: string;
  address: string;
  longitude: number;
  latitude: number;
  branchId: number;
  branch: Branch;
  districtId: number;
  district: District;
  townshipId: number;
  township: Township;
}

export class Bts extends BaseModel implements Deserializable<Bts> {
  siteCode: string;
  address: string;
  longitude: number;
  latitude: number;

  branchId: number;
  branch: Branch;
  get branchName(): string {
    return this.branch ? this.branch.name : '';
  }

  districtId: number;
  district: District;
  get districtName(): string {
    return this.district ? this.district.name : '';
  }

  townshipId: number;
  township: Township;
  get townshipName(): string {
    return this.township ? this.township.name : '';
  }

  constructor() {
    super();
  }

  deserialize(input: Partial<BtsInterface>): Bts {
    if (!input) {
      return;
    }
    super.deserialize(input);
    Object.assign(this, input);

    this.branch = input.branch instanceof Branch ? input.branch : new Branch().deserialize(input.branch);
    this.district = input.district instanceof District ? input.district : new District().deserialize(input.district);
    this.township = input.township instanceof Township ? input.township : new Township().deserialize(input.township);

    return this;
  }

  public toJSON() {
    return {
      siteCode: this.siteCode || null,
      address: this.address || null,
      latitude: this.latitude || null,
      longitude: this.longitude || null,
      branchId: this.branchId || null,
      districtId: this.districtId || null,
      townshipId: this.townshipId || null,
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
