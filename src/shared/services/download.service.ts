import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { KeycloakService } from 'keycloak-angular';

import * as urljoin from 'url-join';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class DownloadService {
  private _apiUrl = environment.api_url;
  public get apiUrl(): string {
    return this._apiUrl;
  }
  public set apiUrl(v: string) {
    this._apiUrl = v;
  }

  constructor(private _httpClient: HttpClient, private _keycloakService: KeycloakService) {}

  private _generateHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this._keycloakService.addTokenToHeader(headers);
    return headers;
  }

  public get(url: string, opts?: any): Observable<any> {
    const headers = this._generateHeaders();
    const path = urljoin(this.apiUrl, url);

    let params = new HttpParams();

    if (opts) {
      Object.keys(opts).map((k) => {
        if ((opts[k] && opts[k].constructor === Boolean) || opts[k] === false) {
          params = params.append(k, Number(opts[k]).toString());
        } else {
          params = params.append(k, opts[k]);
        }
      });
    }

    return this._httpClient
      .get(path, {
        headers: headers,
        params: params,
        responseType: 'blob',
      })
      .map((response: Blob) => {
        return response;
      })
      .catch((errors: HttpErrorResponse) => {
        return Observable.throw(errors);
      });
  }
}
