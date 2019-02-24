import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CustomerType } from 'models/customer-type';

@Injectable({
  providedIn: 'root',
})
export class CustomerTypeService {
  constructor(private _api: ApiService) {}

  public customerTypes(params?: any) {
    return this._api.get(`customer-types`).map((res) => {
      const data = res.data;

      const customerTypes: CustomerType[] = [];

      res.data.customerTypes.forEach((item) => {
        customerTypes.push(new CustomerType(item));
      });

      return { ...data, customerTypes };
    });
  }

  public customerTypesRead(params?: any) {
    return this._api.get(`customers/read`, params).map((res) => {
      const data: CustomerType[] = [];
      if (res.data.typeOfCompanys) {
        res.data.typeOfCompanys.forEach((item) => {
          data.push(
            new CustomerType({
              ...item,
              child: { state: 'Type Of Companies' },
            }),
          );
        });
      }

      if (res.data.typeOfGroups) {
        res.data.typeOfGroups.forEach((item) => {
          data.push(
            new CustomerType({
              ...item,
              child: { state: 'Type Of Groups' },
            }),
          );
        });
      }

      return data;
    });
  }
}
