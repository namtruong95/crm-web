import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Quotation } from 'models/quotation';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  constructor(private _api: ApiService, private _download: DownloadService) {}

  public filterProposal(params?: any) {
    return this._api.get(`proposal/filters`, params).map((res) => {
      res.data.proposalList = res.data.proposalList.map((item) => new Quotation().deserialize(item));
      return res.data;
    });
  }

  public exportProposal(params?: any) {
    return this._download.get(`proposal/proposalPdf.pdf`, params);
  }
}
