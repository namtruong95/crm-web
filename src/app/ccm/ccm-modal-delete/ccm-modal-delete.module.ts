import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcmModalDeleteComponent } from './ccm-modal-delete.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CcmModalDeleteComponent],
  entryComponents: [CcmModalDeleteComponent],
  exports: [CcmModalDeleteComponent],
})
export class CcmModalDeleteModule {}
