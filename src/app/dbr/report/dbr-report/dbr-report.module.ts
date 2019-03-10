import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbrReportComponent } from './dbr-report.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: DbrReportComponent,
    children: [
      {
        path: 'sale-activities',
        loadChildren: '../report-sale-activity/report-sale-activity.module#ReportSaleActivityModule',
      },
      {
        path: 'schedulers',
        loadChildren: '../report-scheduler/report-scheduler.module#ReportSchedulerModule',
      },
      {
        path: 'quotations',
        loadChildren: '../report-quotation/report-quotation.module#ReportQuotationModule',
      },
      {
        path: 'customer-care',
        loadChildren: '../report-customer-care/report-customer-care.module#ReportCustomerCareModule',
      },
    ],
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
  declarations: [DbrReportComponent],
})
export class DbrReportModule {}
