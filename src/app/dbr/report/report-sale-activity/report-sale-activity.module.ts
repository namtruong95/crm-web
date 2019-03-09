import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSaleActivityComponent } from './report-sale-activity.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportFilterModule } from '../report-filter/report-filter.module';

const routes: Routes = [
  {
    path: '',
    component: ReportSaleActivityComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, ReportFilterModule],
  declarations: [ReportSaleActivityComponent],
})
export class ReportSaleActivityModule {}
