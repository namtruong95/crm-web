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
      const data = res.data;

      const proposalList: Quotation[] = [];

      res.data.proposalList.forEach((item) => {
        proposalList.push(new Quotation(item));
      });
      return { ...data, proposalList };
    });
  }

  public exportProposal(params?: any) {
    return this._download.get(`proposal/proposalPdf.pdf`, params);
  }
}
