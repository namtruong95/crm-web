import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private _api: ApiService) {}

  public getDashboard(params?: any) {
    return this._api.get(`dashboard`, params).map((res) => {
      return res.data;
    });
  }
}
