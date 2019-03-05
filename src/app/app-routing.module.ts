import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/guard/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { LayoutHeaderComponent } from './layout-header/layout-header.component';
import { LayoutNavComponent } from './layout-nav/layout-nav.component';
import { Roles } from './guard/roles';
import { CommonModule } from '@angular/common';
import { AppResolve } from './app.reslove';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    resolve: {
      app: AppResolve,
    },
    children: [
      {
        path: 'cim',
        canActivate: [AuthGuard],
        data: {
          roles: [
            Roles.BRANCH_DIRECTOR,
            Roles.BRANCH_SALE_STAFF,
            Roles.HQ_SALE_STAFF,
            Roles.MYTEL_ADMIN,
            Roles.SALE_DIRECTOR,
          ],
        },
        loadChildren: './cim/cim.module#CimModule',
      },
      {
        path: 'msm',
        canActivate: [AuthGuard],
        data: {
          roles: [
            Roles.BRANCH_DIRECTOR,
            Roles.BRANCH_SALE_STAFF,
            Roles.HQ_SALE_STAFF,
            Roles.MYTEL_ADMIN,
            Roles.SALE_DIRECTOR,
          ],
        },
        loadChildren: './msm/msm.module#MsmModule',
      },
      {
        path: 'ssm',
        data: {
          roles: [
            Roles.BRANCH_DIRECTOR,
            Roles.BRANCH_SALE_STAFF,
            Roles.HQ_SALE_STAFF,
            Roles.MYTEL_ADMIN,
            Roles.SALE_DIRECTOR,
          ],
        },
        canActivate: [AuthGuard],
        loadChildren: './ssm/ssm.module#SsmModule',
      },
      {
        path: 'ccm',
        data: {
          roles: [
            Roles.BRANCH_DIRECTOR,
            Roles.BRANCH_SALE_STAFF,
            Roles.HQ_SALE_STAFF,
            Roles.MYTEL_ADMIN,
            Roles.SALE_DIRECTOR,
          ],
        },
        canActivate: [AuthGuard],
        loadChildren: './ccm/ccm.module#CcmModule',
      },
      {
        path: 'dbr',
        data: {
          roles: [
            Roles.BRANCH_DIRECTOR,
            Roles.BRANCH_SALE_STAFF,
            Roles.HQ_SALE_STAFF,
            Roles.MYTEL_ADMIN,
            Roles.SALE_DIRECTOR,
          ],
        },
        canActivate: [AuthGuard],
        loadChildren: './dbr/dbr.module#DbrModule',
      },
      {
        path: 'users',
        data: {
          roles: [Roles.MYTEL_ADMIN],
        },
        canActivate: [AuthGuard],
        loadChildren: './user/user.module#UserModule',
      },
      {
        path: 'timeline',
        data: {
          roles: [
            Roles.BRANCH_DIRECTOR,
            Roles.BRANCH_SALE_STAFF,
            Roles.HQ_SALE_STAFF,
            Roles.MYTEL_ADMIN,
            Roles.SALE_DIRECTOR,
          ],
        },
        canActivate: [AuthGuard],
        loadChildren: './timeline/timeline.module#TimelineModule',
      },
      {
        path: '',
        redirectTo: 'dbr',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '404',
    loadChildren: './page-404/page-404.module#Page404Module',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
  declarations: [LayoutComponent, LayoutHeaderComponent, LayoutNavComponent],
  providers: [AuthGuard, AppResolve],
})
export class AppRoutingModule {}
