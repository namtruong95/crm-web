import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CimService {
  private _date: string;
  public get date(): string {
    return this._date;
  }
  public set date(v: string) {
    this._date = v;
  }

  constructor() {}
}
