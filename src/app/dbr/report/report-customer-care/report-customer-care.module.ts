import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportCustomerCareComponent } from './report-customer-care.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ReportCustomerCareComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
  declarations: [ReportCustomerCareComponent],
})
export class ReportCustomerCareModule {}
