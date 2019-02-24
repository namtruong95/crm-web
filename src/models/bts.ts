import { BaseModel } from './base';
import { Marker } from 'interfaces/maker';

export class Bts extends BaseModel {
  private _siteCode: string;
  public get siteCode(): string {
    return this._siteCode;
  }
  public set siteCode(v: string) {
    this._siteCode = v;
  }

  private _address: string;
  public get address(): string {
    return this._address;
  }
  public set address(v: string) {
    this._address = v;
  }

  private _stateRegion: string;
  public get stateRegion(): string {
    return this._stateRegion;
  }
  public set stateRegion(v: string) {
    this._stateRegion = v;
  }

  private _townShip: string;
  public get townShip(): string {
    return this._townShip;
  }
  public set townShip(v: string) {
    this._townShip = v;
  }

  private _latitude: number;
  public get latitude(): number {
    return this._latitude || null;
  }
  public set latitude(v: number) {
    this._latitude = v;
  }

  private _longitude: number;
  public get longitude(): number {
    return this._longitude || null;
  }
  public set longitude(v: number) {
    this._longitude = v;
  }

  constructor(d?: any) {
    super(d);

    if (d) {
      this.siteCode = d.siteCode;
      this.address = d.address;
      this.stateRegion = d.state;
      this.townShip = d.townShip;
      this.longitude = d.longitude;
      this.latitude = d.latitude;
    }
  }

  public toJSON() {
    return {
      state: this.stateRegion || null,
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
