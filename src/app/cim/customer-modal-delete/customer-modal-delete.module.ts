import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerModalDeleteComponent } from './customer-modal-delete.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CustomerModalDeleteComponent],
  exports: [CustomerModalDeleteComponent],
  entryComponents: [CustomerModalDeleteComponent],
})
export class CustomerModalDeleteModule {}
