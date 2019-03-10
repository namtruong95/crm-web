import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-page-404',
  templateUrl: './page-404.component.html',
  styleUrls: ['./page-404.component.scss'],
})
export class Page404Component {
  constructor(private _keyCloakSv: KeycloakService) {}

  logout() {
    this._keyCloakSv.logout(location.origin).then(() => {
      this._keyCloakSv.clearToken();
    });
  }
}
