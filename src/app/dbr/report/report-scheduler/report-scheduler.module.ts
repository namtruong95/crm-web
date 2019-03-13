import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSchedulerComponent } from './report-scheduler.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../report-filter/report-filter.module';
import { ReportService } from 'shared/services/report.service';
const routes: Routes = [
  {
    path: '',
    component: ReportSchedulerComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, ReportFilterModule],
  declarations: [ReportSchedulerComponent],
  providers: [ReportService],
})
export class ReportSchedulerModule {}
