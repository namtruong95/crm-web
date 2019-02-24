import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtsModalDeleteComponent } from './bts-modal-delete.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BtsModalDeleteComponent],
  entryComponents: [BtsModalDeleteComponent],
  exports: [BtsModalDeleteComponent],
})
export class BtsModalDeleteModule {}
