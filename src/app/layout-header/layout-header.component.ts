import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

import { uiAvatars } from 'shared/utils/ui-avatars';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss'],
})
export class LayoutHeaderComponent {
  public get name(): string {
    return this.keycloakService.getUsername();
  }

  public get avatar(): string {
    return uiAvatars(this.name);
  }

  constructor(private keycloakService: KeycloakService) {}
  public logout() {
    this.keycloakService.logout().then(() => {
      this.keycloakService.clearToken();
    });
  }
}
