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
      const data = res.data;

      const customerList: Customer[] = [];

      res.data.customerList.forEach((item) => {
        customerList.push(new Customer(item));
      });
      return { ...data, customerList };
    });
  }

  public showCustomer(id: number, opts?: any) {
    return this._api.get(`customers/${id}`, opts).map((res) => {
      if (res.data && res.data.customer) {
        return new Customer(res.data.customer);
      }

      return;
    });
  }

  public filterCustomers(params?: any) {
    return this._api.get(`customers/filters`, params).map((res) => {
      const data = res.data;

      const customerList: Customer[] = [];

      res.data.customerList.forEach((item) => {
        customerList.push(new Customer(item));
      });

      return { ...data, customerList };
    });
  }

  public searchCustomers(params?: any) {
    return this._api.get(`customers/filters`, params).map((res) => {
      const data = res.data;

      const customerList: Customer[] = [];

      res.data.customerList.forEach((item) => {
        customerList.push(new Customer(item));
      });
      return customerList;
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
