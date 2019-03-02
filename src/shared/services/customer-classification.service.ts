import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CustomerClassification } from 'models/customer-classification';

@Injectable({
  providedIn: 'root',
})
export class CustomerClassificationService {
  constructor(private _api: ApiService) {}

  public getCustomerClassification(params: any) {
    return this._api.get(`customer-classifications`, params).map((res) => {
      res.data.customerClassifications = res.data.customerClassifications.map((item) =>
        new CustomerClassification().deserialize(item),
      );
      return res.data;
    });
  }
}
