import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbrDashboardComponent } from './dbr-dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardService } from 'shared/services/dashboard.service';
import { DbrDashboardFilterModule } from '../dbr-dashboard-filter/dbr-dashboard-filter.module';

const routes: Routes = [
  {
    path: '',
    component: DbrDashboardComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), DbrDashboardFilterModule],
  declarations: [DbrDashboardComponent],
  providers: [DashboardService],
})
export class DbrDashboardModule {}
