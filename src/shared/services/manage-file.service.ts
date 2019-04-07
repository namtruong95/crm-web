import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ManagePdf } from 'models/manage-pdf';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root',
})
export class ManageFileService {
  constructor(private _api: ApiService, private _download: DownloadService) {}

  public getFiles(opts?: any) {
    return this._api.get(`manage-file`, opts).map((res) => {
      res.data.list = res.data.list.map((item) => new ManagePdf().deserialize(item));
      return res.data;
    });
  }

  public getAllFiles(opts?: any) {
    return this._api.get(`manage-file/all`, opts).map((res) => {
      return res.data.listFile.map((item) => new ManagePdf().deserialize(item));
    });
  }

  public getFile(id: number, opts?: any) {
    return this._api.get(`manage-file/${id}`, opts);
  }

  public downloadFile(id: number, opts?: any) {
    return this._download.get(`manage-file/download-file/${id}`, opts);
  }

  public deleteFile(id: number) {
    return this._api.delete(`manage-file/${id}`);
  }
}
