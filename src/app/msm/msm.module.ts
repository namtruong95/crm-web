import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsmComponent } from './msm.component';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerCalendarModule } from './scheduler-calendar/scheduler-calendar.module';
import { SaleActivityListModule } from './sale-activity-list/sale-activity-list.module';
import { AuthGuard } from 'app/guard/auth.guard';
import { Roles } from 'app/guard/roles';

const routes: Routes = [
  {
    path: '',
    component: MsmComponent,
    children: [
      {
        path: 'filters',
        loadChildren: './scheduler-filter/scheduler-filter.module#SchedulerFilterModule',
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        data: {
          roles: [Roles.BRANCH_DIRECTOR, Roles.SALE_DIRECTOR, Roles.BRANCH_SALE_STAFF, Roles.HQ_SALE_STAFF],
        },
        loadChildren: './scheduler-create/scheduler-create.module#SchedulerCreateModule',
      },
      {
        path: '',
        redirectTo: 'filters',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SchedulerCalendarModule, SaleActivityListModule],
  declarations: [MsmComponent],
})
export class MsmModule {}
