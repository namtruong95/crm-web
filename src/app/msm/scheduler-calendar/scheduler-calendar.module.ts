import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerCalendarComponent } from './scheduler-calendar.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SchedulerModalEditModule } from '../scheduler-modal-edit/scheduler-modal-edit.module';

@NgModule({
  imports: [CommonModule, SchedulerModalEditModule, ModalModule.forRoot()],
  declarations: [SchedulerCalendarComponent],
  exports: [SchedulerCalendarComponent],
})
export class SchedulerCalendarModule {}
