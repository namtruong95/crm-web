import { Injectable } from '@angular/core';
import { Folder } from 'models/folder';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  constructor(private _api: ApiService) {}

  public getListFolder(opts: any = {}) {
    return this._api.get(`folder`, opts).map((res) => {
      return res.data.folder.map((item) => new Folder().deserialize(item));
    });
  }

  public createFolder(data: any) {
    return this._api.post(`folder`, data);
  }

  public updateFolder(id: number, data: any) {
    return this._api.put(`folder/${id}`, data);
  }

  public deleteFolder(id: number) {
    return this._api.delete(`folder/${id}`);
  }
}
