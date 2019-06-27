import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportQuotationFilterComponent } from './report-quotation-filter.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [CommonModule, FormsModule, BsDatepickerModule.forRoot(), NgSelectModule],
  declarations: [ReportQuotationFilterComponent],
  exports: [ReportQuotationFilterComponent],
})
export class ReportQuotationFilterModule {}
