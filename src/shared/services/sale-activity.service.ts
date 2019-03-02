import { Injectable } from '@angular/core';
import { SaleActivity } from 'models/sale-activity';
import { ApiService } from './api.service';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root',
})
export class SaleActivityService {
  constructor(private _api: ApiService, private _download: DownloadService) {}

  public getSaleActivities(params?: any) {
    return this._api.get(`sale-activity`, params).map((res) => {
      res.data.customerSaleActivityList = res.data.customerSaleActivityList.map((item) =>
        new SaleActivity().deserialize(item),
      );
      return res.data;
    });
  }

  public createSaleActivities(body: any) {
    return this._api.post(`sale-activity`, body);
  }

  public updateSaleActivities(id: number, body: any) {
    return this._api.put(`sale-activity/${id}`, body);
  }

  public removeSaleActivities(id: number) {
    return this._api.delete(`sale-activity/${id}`);
  }

  public exportSaleActivity(params?: any) {
    return this._download.get(`sale-activity/export`, params);
  }
}
