import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbrComponent } from './dbr.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DbrComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dbr-dashboard/dbr-dashboard.module#DbrDashboardModule',
      },
      {
        path: 'reports',
        loadChildren: './report/dbr-report/dbr-report.module#DbrReportModule',
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [DbrComponent],
})
export class DbrModule {}
