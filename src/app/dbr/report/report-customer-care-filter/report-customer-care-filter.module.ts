import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportCustomerCareFilterComponent } from './report-customer-care-filter.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [CommonModule, FormsModule, BsDatepickerModule.forRoot(), NgSelectModule],
  declarations: [ReportCustomerCareFilterComponent],
  exports: [ReportCustomerCareFilterComponent],
})
export class ReportCustomerCareFilterModule {}
