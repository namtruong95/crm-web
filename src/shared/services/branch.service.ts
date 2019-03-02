import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Branch } from 'models/branch';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private _api: ApiService) {}

  public getBranchList(opts?: any) {
    return this._api.get(`branch`).map((res) => {
      res.data.branches = res.data.branches.map((item) => new Branch().deserialize(item));
      return res.data;
    });
  }
}
