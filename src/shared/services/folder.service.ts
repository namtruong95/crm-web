import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Folder } from 'models/folder';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  constructor() {}

  public getListFolder(opts: any = {}) {
    return Observable.of({
      data: [
        {
          id: 1,
          name: 'root',
        },
        {
          id: 2,
          name: 'root 2',
        },
        {
          id: 3,
          name: 'root 3',
        },
        {
          id: 4,
          name: 'root 4',
        },
      ].map((item) => new Folder().deserialize(item)),
    }).delay(500);
  }

  public createFolder(data: any) {
    return Observable.of(true).delay(1000);
  }

  public updateFolder(id: number, data: any) {
    return Observable.of(true).delay(1000);
  }

  public deleteFolder(id: number) {
    return Observable.of(true).delay(1000);
  }
}
