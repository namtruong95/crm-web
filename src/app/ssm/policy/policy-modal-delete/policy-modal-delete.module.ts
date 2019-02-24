import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyModalDeleteComponent } from './policy-modal-delete.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PolicyModalDeleteComponent],
  entryComponents: [PolicyModalDeleteComponent],
  exports: [PolicyModalDeleteComponent],
})
export class PolicyModalDeleteModule {}
