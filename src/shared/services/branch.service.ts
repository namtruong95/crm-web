import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Branch } from 'models/branch';
import { Township } from 'models/township';
import { District } from 'models/district';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private _api: ApiService) {}

  public getBranchList(opts?: any) {
    return this._api.get(`branch`, opts).map((res) => {
      res.data.branches = res.data.branches.map((item) => new Branch().deserialize(item));
      return res.data;
    });
  }

  public getDistrictList(opts?: any) {
    return this._api.get(`district`, opts).map((res) => {
      res.data.districts = res.data.districts.map((item) => new District().deserialize(item));
      return res.data;
    });
  }

  public getTownshipList(opts?: any) {
    return this._api.get('township', opts).map((res) => {
      res.data.townships = res.data.townships.map((item) => new Township().deserialize(item));

      return res.data;
    });
  }
}
