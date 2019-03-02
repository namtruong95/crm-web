import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ManagePdf } from 'models/manage-pdf';

@Injectable({
  providedIn: 'root',
})
export class ManageFileService {
  constructor(private _api: ApiService) {}

  public getFiles(opts?: any) {
    return this._api.get(`manage-file`, opts).map((res) => {
      res.data.list = res.data.list.map((item) => new ManagePdf().deserialize(item));
      return res.data;
    });
  }

  public downloadFile(id: number, opts?: any) {
    return this._api.get(`manage-file/${id}`, opts);
  }

  public deleteFile(id: number) {
    return this._api.delete(`manage-file/${id}`);
  }
}
