import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { initializer } from './app-init';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';

import { SharedModule } from 'shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { RoleService } from './role.service';

import 'shared/extensions/number';
import 'shared/extensions/string';
import { RootScopeService } from './services/root-scope.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, KeycloakAngularModule, AppRoutingModule, SharedModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService],
    },
    RoleService,
    RootScopeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
