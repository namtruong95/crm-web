import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SaleActivity2 } from 'models/sale-activity-2';

@Injectable({
  providedIn: 'root',
})
export class SaleActivity2Service {
  constructor(private _api: ApiService) {}

  public getSaleActivitiesList(params?: any) {
    return this._api.get(`sale-activities`, params).map((res) => {
      res.data.list = res.data.list.map((item) => {
        return new SaleActivity2(item);
      });
      return res.data;
    });
  }

  public filterSaleActivities(params?: any) {
    return this._api.get(`sale-activities`, params).map((res) => {
      return (res.data.list = res.data.list.map((item) => {
        return new SaleActivity2(item);
      }));
    });
  }

  public createSaleActivity(data: any) {
    return this._api.post(`sale-activities`, data);
  }

  public updateSaleActivity(id: number, data: any) {
    return this._api.put(`sale-activities/${id}`, data);
  }

  public removeSaleActivity(id: number) {
    return this._api.delete(`sale-activities/${id}`);
  }
}
