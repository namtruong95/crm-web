import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Quotation } from 'models/quotation';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  constructor(private _api: ApiService, private _download: DownloadService) {}

  public filterQuotations(params?: any) {
    return this._api.get(`quotation/filters`, params).map((res) => {
      res.data.quotationList = res.data.quotationList.map((item) => new Quotation().deserialize(item));
      return res.data;
    });
  }

  public createQuotation(body: any) {
    return this._api.post(`quotation`, body);
  }

  public updateQuotation(id: number, body: any) {
    return this._api.put(`quotation/${id}`, body);
  }

  public deleteQuotation(id: number) {
    return this._api.delete(`quotation/${id}`);
  }

  public exportQuotation(params?: any) {
    return this._download.get(`proposal/quotation.pdf`, params);
  }
}
