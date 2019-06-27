import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportQuotationComponent } from './report-quotation.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportQuotationFilterModule } from '../report-quotation-filter/report-quotation-filter.module';
import { ReportService } from 'shared/services/report.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';

const routes: Routes = [
  {
    path: '',
    component: ReportQuotationComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReportQuotationFilterModule,
    PaginationModule.forRoot(),
  ],
  declarations: [ReportQuotationComponent],
  providers: [ReportService],
})
export class ReportQuotationModule {}
