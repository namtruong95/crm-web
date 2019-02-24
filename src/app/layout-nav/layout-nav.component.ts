import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from 'shared/utils/script-loader.service';
import { KeycloakService } from 'keycloak-angular';
import { Roles } from '../guard/roles';
import { Router } from '@angular/router';

import * as $ from 'jquery';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-layout-nav',
  templateUrl: './layout-nav.component.html',
  styleUrls: ['./layout-nav.component.scss'],
  providers: [ScriptLoaderService],
})
export class LayoutNavComponent implements OnInit, AfterViewInit {
  constructor(private _script: ScriptLoaderService, private _router: Router, public role: RoleService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    $(`#${this._router.url.slice(1, 4)}LI`)
      .find('a')
      .first()
      .attr('aria-expanded', 'true');
    $(`#${this._router.url.slice(1, 4)}LI`)
      .find('a')
      .first()
      .removeClass('collapsed');
    $(`#${this._router.url.slice(1, 4)}LI`)
      .find('ul')
      .first()
      .addClass('show');
  }
}
