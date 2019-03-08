import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportFilterComponent } from './report-filter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [ReportFilterComponent],
  exports: [ReportFilterComponent],
})
export class ReportFilterModule {}
