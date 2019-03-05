import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { JwtHelper } from 'shared/utils/jwt.helper';
import { UserService } from 'shared/services/user.service';
import { Roles } from './guard/roles';
import { RootScopeService } from './services/root-scope.service';
import { User } from 'models/user';
import { Helpers } from 'shared/utils/helpers';

@Injectable()
export class AppResolve implements Resolve<any> {
  constructor(
    private _keyCloakSv: KeycloakService,
    private _userSv: UserService,
    private _rootScope: RootScopeService,
    private _router: Router,
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    try {
      Helpers.setLoading(true);
      const token = await this._keyCloakSv.getToken();

      const decode = JwtHelper.decodeToken(token);

      if (decode.realm_access.roles.includes(Roles.MYTEL_ADMIN)) {
        return;
      }

      const res = await this._userSv.checkUserExists(decode.preferred_username).toPromise();
      this._rootScope.currentUser = new User().deserialize(res.data.user);
      Helpers.setLoading(false);
      return;
    } catch (errors) {
      this._router.navigate(['/404']);
      Helpers.setLoading(false);
      return;
    }
  }
}
