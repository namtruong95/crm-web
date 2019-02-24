import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as urljoin from 'url-join';
import { environment } from 'environments/environment';
import { KeycloakService } from 'keycloak-angular';

import 'rxjs/add/operator/share';

@Injectable()
export class UploaderService {
  private _apiUrl = environment.api_url;
  public get apiUrl(): string {
    return this._apiUrl;
  }
  public set apiUrl(v: string) {
    this._apiUrl = v;
  }

  private _progress = 0;
  public get progress(): number {
    return this._progress;
  }
  public set progress(v: number) {
    this._progress = v;
  }

  private _progressObserver;

  constructor(private _kcSv: KeycloakService) {
    this.progress = Observable.create((observer) => {
      this._progressObserver = observer;
    }).share();
  }
  /**
   * @param method POST/PUT
   * @param url string
   * @param files Array {key, value}
   * @param params Object
   */
  private _getFormData(method, url: string, files: Array<any> = [], params: any = {}): Observable<any> {
    return Observable.create((observer) => {
      const formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();

      files.map((item: any) => {
        if (item.value) {
          formData.append(item.key, item.value, item.value.name);
        }
      });

      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          if (params[key] instanceof Array) {
            params[key].forEach((item, idx) => {
              formData.append(`${key}[]`, params[key][idx]);
            });
          } else {
            formData.append(key, params[key]);
          }
        }
      }
      const path_url = urljoin(this.apiUrl, url);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 201 || xhr.status === 204) {
            if (xhr.response === '') {
              observer.next({ success: true });
              observer.complete();
              return;
            }

            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            const errors = JSON.parse(xhr.response);
            observer.error(errors);
          }
        }
      };

      xhr.upload.onprogress = (event) => {
        this.progress = Math.round((event.loaded / event.total) * 100);
        if (this._progressObserver !== undefined) {
          this._progressObserver.next(this.progress);
        }
      };

      xhr.open(method, path_url, true);

      this._kcSv.getToken().then((token) => {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    });
  }

  public store(url: string, files: any[], params: any = {}): Observable<any> {
    return this._getFormData('POST', url, files, params);
  }

  public update(url: string, files: any[], params: any = {}): Observable<any> {
    return this._getFormData('PUT', url, files, params);
  }
}
