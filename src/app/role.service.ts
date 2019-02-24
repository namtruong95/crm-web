import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Roles } from './guard/roles';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private keycloakService: KeycloakService) {}

  public get is_admin(): boolean {
    return this.keycloakService.isUserInRole(Roles.MYTEL_ADMIN);
  }
  public get is_branch_director(): boolean {
    return this.keycloakService.isUserInRole(Roles.BRANCH_DIRECTOR);
  }
  public get is_branch_sale_staff(): boolean {
    return this.keycloakService.isUserInRole(Roles.BRANCH_SALE_STAFF);
  }
  public get is_hq_sale_staff(): boolean {
    return this.keycloakService.isUserInRole(Roles.HQ_SALE_STAFF);
  }
  public get is_sale_director(): boolean {
    return this.keycloakService.isUserInRole(Roles.SALE_DIRECTOR);
  }
}
