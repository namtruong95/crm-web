import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { RootScopeService } from './services/root-scope.service';
import { JwtHelper } from 'shared/utils/jwt.helper';
import { KeyCloakUser } from 'models/kc-user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _keyCloakSv: KeycloakService, private _rootScope: RootScopeService) {
    this._keyCloakSv.getToken().then((token) => {
      const decode = JwtHelper.decodeToken(token);

      this._rootScope.user = new KeyCloakUser({
        id: decode.sub,
        email: decode.email,
        username: decode.preferred_username,
        firstName: decode.given_name,
        lastName: decode.family_name,
        fullName: decode.name,
      });
    });
  }
}
