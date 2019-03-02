import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Customer } from 'models/customer';
import { of } from 'rxjs/internal/observable/of';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private _api: ApiService, private _download: DownloadService) {}

  public customersList(params?: any) {
    return this._api.get(`customers`, params).map((res) => {
      res.data.customerList = res.data.customerList.map((item) => new Customer().deserialize(item));
      return res.data;
    });
  }

  public showCustomer(id: number, opts?: any) {
    return this._api.get(`customers/${id}`, opts).map((res) => {
      if (res.data && res.data.customer) {
        return new Customer().deserialize(res.data.customer);
      }

      return;
    });
  }

  public filterCustomers(params?: any) {
    return this._api.get(`customers/filters`, params).map((res) => {
      res.data.customerList = res.data.customerList.map((item) => new Customer().deserialize(item));
      return res.data;
    });
  }

  public searchCustomers(params?: any) {
    return this._api.get(`customers/filters`, params).map((res) => {
      return res.data.customerList.map((item) => new Customer().deserialize(item));
    });
  }

  public createCustomer(data: any) {
    return this._api.post(`customers`, data);
  }

  public updateCustomer(id: number, data: any) {
    return this._api.put(`customers/${id}`, data);
  }

  public removeCustomer(id: number) {
    return this._api.delete(`customers/${id}`);
  }

  public exportCustomer(params?: any) {
    return this._download.get(`customers/export`, params);
  }
}
