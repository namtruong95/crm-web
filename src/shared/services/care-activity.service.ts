import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CustomerCareActivity } from 'models/customer-care-activity';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root',
})
export class CareActivityService {
  constructor(private _api: ApiService, private _download: DownloadService) {}

  public filterActivities(params?: any) {
    return this._api.get(`care-activity`, params).map((res) => {
      const data = res.data;

      const customerCareActivityList: CustomerCareActivity[] = [];

      res.data.customerCareActivityList.forEach((item) => {
        customerCareActivityList.push(new CustomerCareActivity(item));
      });
      return { ...data, customerCareActivityList };
    });
  }

  public createCareActivity(data: any) {
    return this._api.post(`care-activity`, data);
  }

  public updateCareActivity(id: number, data: any) {
    return this._api.put(`care-activity/${id}`, data);
  }

  public removeCareActivity(id: number) {
    return this._api.delete(`care-activity/${id}`);
  }

  public exportCCM(params?: any) {
    return this._download.get(`care-activity/export`, params);
  }
}
