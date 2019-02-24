import { Injectable } from '@angular/core';
import { KeyCloakService } from './kc.service';
import { KeyCloakUser } from 'models/kc-user';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  constructor(private _kc: KeyCloakService) {}

  public getStaffs(params?: any) {
    return this._kc.get(`admin/realms/${environment.kc_realm}/users`, params).map((res) => {
      const data: KeyCloakUser[] = [];

      res.map((item) => {
        if (item.email) {
          data.push(new KeyCloakUser(item));
        }
      });

      return data;
    });
  }
}
