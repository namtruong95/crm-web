import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CustomerType } from 'models/customer-type';

@Injectable({
  providedIn: 'root',
})
export class CustomerTypeService {
  constructor(private _api: ApiService) {}

  public customerTypes(params?: any) {
    return this._api.get(`customer-types`, params).map((res) => {
      res.data.customerTypes = res.data.customerTypes.map((item) => new CustomerType().deserialize(item));
      return res.data;
    });
  }

  public customerTypesRead(params?: any) {
    return this._api.get(`customers/read`, params).map((res) => {
      const data: CustomerType[] = [];
      if (res.data.typeOfCompanys) {
        res.data.typeOfCompanys.forEach((item) => {
          data.push(
            new CustomerType().deserialize({
              ...item,
              child: { state: 'Type Of Companies' },
            }),
          );
        });
      }

      if (res.data.typeOfGroups) {
        res.data.typeOfGroups.forEach((item) => {
          data.push(
            new CustomerType().deserialize({
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
