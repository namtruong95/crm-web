import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationModalDeleteComponent } from './quotation-modal-delete.component';

@NgModule({
  imports: [CommonModule],
  declarations: [QuotationModalDeleteComponent],
  entryComponents: [QuotationModalDeleteComponent],
  exports: [QuotationModalDeleteComponent],
})
export class QuotationModalDeleteModule {}
