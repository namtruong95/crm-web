import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportCustomerCareComponent } from './report-customer-care.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportCustomerCareFilterModule } from '../report-customer-care-filter/report-customer-care-filter.module';
import { ReportService } from 'shared/services/report.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';

const routes: Routes = [
  {
    path: '',
    component: ReportCustomerCareComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReportCustomerCareFilterModule,
    PaginationModule.forRoot(),
  ],
  declarations: [ReportCustomerCareComponent],
  providers: [ReportService],
})
export class ReportCustomerCareModule {}
