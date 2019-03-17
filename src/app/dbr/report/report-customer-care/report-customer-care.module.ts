import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportCustomerCareComponent } from './report-customer-care.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../report-filter/report-filter.module';
import { ReportService } from 'shared/services/report.service';

const routes: Routes = [
  {
    path: '',
    component: ReportCustomerCareComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, ReportFilterModule],
  declarations: [ReportCustomerCareComponent],
  providers: [ReportService],
})
export class ReportCustomerCareModule {}
