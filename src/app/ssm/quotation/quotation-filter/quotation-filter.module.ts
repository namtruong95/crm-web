import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationFilterComponent } from './quotation-filter.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: QuotationFilterComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, NgSelectModule],
  declarations: [QuotationFilterComponent],
})
export class QuotationFilterModule {}
