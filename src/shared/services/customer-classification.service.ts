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
      const data = res.data;
      const customerClassifications: CustomerClassification[] = [];

      res.data.customerClassifications.forEach((item) => {
        customerClassifications.push(new CustomerClassification(item));
      });

      return { ...data, customerClassifications };
    });
  }
}
