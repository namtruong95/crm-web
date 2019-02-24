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
      const data = res.data;

      const list: ManagePdf[] = [];

      res.data.list.forEach((item) => {
        list.push(new ManagePdf(item));
      });
      return { ...data, list };
    });
  }

  public downloadFile(id: number, opts?: any) {
    return this._api.get(`manage-file/${id}`, opts);
  }

  public deleteFile(id: number) {
    return this._api.delete(`manage-file/${id}`);
  }
}
