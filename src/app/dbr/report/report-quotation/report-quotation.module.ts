import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportQuotationComponent } from './report-quotation.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../report-filter/report-filter.module';
import { ReportService } from 'shared/services/report.service';

const routes: Routes = [
  {
    path: '',
    component: ReportQuotationComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, ReportFilterModule],
  declarations: [ReportQuotationComponent],
  providers: [ReportService],
})
export class ReportQuotationModule {}
