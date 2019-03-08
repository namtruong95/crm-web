import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSchedulerComponent } from './report-scheduler.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: ReportSchedulerComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
  declarations: [ReportSchedulerComponent],
})
export class ReportSchedulerModule {}
