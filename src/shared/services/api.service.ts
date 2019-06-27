import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

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
export class ApiService {
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

    const params = this._initParams(opts);

    return this._httpClient
      .get(path, {
        headers: headers,
        params: params,
      })
      .map((response: Response) => {
        return response;
      })
      .catch((errors: HttpErrorResponse) => {
        return Observable.throw(errors);
      });
  }

  public post(url: string, body?: any): Observable<any> {
    const headers = this._generateHeaders();
    const path = urljoin(this.apiUrl, url);

    return this._httpClient
      .post(path, body, {
        headers: headers,
      })
      .map((response: Response) => {
        return response;
      })
      .catch((errors: HttpErrorResponse) => {
        return Observable.throw(errors);
      });
  }

  public put(url: string, body: any): Observable<any> {
    const headers = this._generateHeaders();
    const path = urljoin(this.apiUrl, url);

    return this._httpClient
      .put(path, body, {
        headers: headers,
      })
      .map((response: Response) => {
        return response;
      })
      .catch((errors: HttpErrorResponse) => {
        return Observable.throw(errors);
      });
  }

  public delete(url: string): Observable<any> {
    const headers = this._generateHeaders();
    const path = urljoin(this.apiUrl, url);

    return this._httpClient
      .delete(path, {
        headers: headers,
      })
      .map((response: Response) => {
        return response;
      })
      .catch((errors: HttpErrorResponse) => {
        return Observable.throw(errors);
      });
  }

  private _initParams(opts: any = {}): HttpParams {
    let params = new HttpParams();

    if (opts) {
      Object.keys(opts).map((k) => {
        if (opts[k] === null || opts[k] === undefined) {
          return;
        }
        if (opts[k] === false) {
          params = params.append(k, Number(opts[k]).toString());
        }

        switch (opts[k].constructor) {
          case Boolean:
            params = params.append(k, Number(opts[k]).toString());
            break;
          case Array:
            opts[k].map((v) => {
              params = params.append(`${k}[]`, v);
            });
            break;

          default:
            params = params.append(k, opts[k]);
            break;
        }
      });
    }

    return params;
  }
}
