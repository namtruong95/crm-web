import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerModalDeleteComponent } from './scheduler-modal-delete.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SchedulerModalDeleteComponent],
  exports: [SchedulerModalDeleteComponent],
  entryComponents: [SchedulerModalDeleteComponent],
})
export class SchedulerModalDeleteModule {}
