import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { Helpers } from 'shared/utils/helpers';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit() {
    this._router.events.subscribe((route) => {
      if (route instanceof NavigationStart) {
        Helpers.setLoading(true);
      }

      if (route instanceof NavigationEnd) {
        Helpers.setLoading(false);
      }

      if (route instanceof NavigationCancel) {
        Helpers.setLoading(false);
      }
    });
  }
}
