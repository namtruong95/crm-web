import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Bts } from 'models/bts';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root',
})
export class BtsService {
  constructor(private _api: ApiService, private _download: DownloadService) {}

  public filterBTS(params?: any) {
    return this._api.get(`bts/filters`, params).map((res) => {
      res.data.btsList = res.data.btsList.map((item) => new Bts().deserialize(item));
      return res.data;
    });
  }

  public createBTS(data: any) {
    return this._api.post(`bts`, data);
  }

  public updateBTS(id: number, data: any) {
    return this._api.put(`bts/${id}`, data);
  }

  public removeBTS(id: number) {
    return this._api.delete(`bts/${id}`);
  }

  public getAllBts(params?: any) {
    return this._api.get(`bts/getAll`, params).map((res) => {
      res.data.btsList = res.data.btsList.map((item) => new Bts().deserialize(item));
      return res.data;
    });
  }

  public exportBts(params?: any) {
    return this._download.get(`bts/export`, params);
  }
}
