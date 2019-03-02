import { Injectable } from '@angular/core';
import { Policy } from 'models/policy';
import { ApiService } from './api.service';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  constructor(private _api: ApiService, private _download: DownloadService) {}

  public filterPolicies(params?: any) {
    return this._api.get(`policy/filters`, params).map((res) => {
      res.data.policyList = res.data.policyList.map((item) => new Policy().deserialize(item));
      return res.data;
    });
  }

  public createPolicy(body: any) {
    return this._api.post(`policy`, body);
  }

  public updatePolicy(id: number, body: any) {
    return this._api.put(`policy/${id}`, body);
  }

  public deletePolicy(id: number) {
    return this._api.delete(`policy/${id}`);
  }

  public findPolicy(params?: any) {
    return this._api.get(`policy/findByPolicy`, params).map((res) => {
      if (res.data && res.data.policy) {
        return new Policy().deserialize(res.data.policy);
      } else {
        return null;
      }
    });
  }

  public exportPolicy(params?: any) {
    return this._download.get(`policy/export`, params);
  }
}
