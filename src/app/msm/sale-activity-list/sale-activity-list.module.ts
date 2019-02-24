import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SaleActivityListComponent } from './sale-activity-list.component';
import { SchedulerModalEditModule } from '../scheduler-modal-edit/scheduler-modal-edit.module';
import { SchedulerModalDeleteModule } from '../scheduler-modal-delete/scheduler-modal-delete.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    FormsModule,
    SchedulerModalEditModule,
    SchedulerModalDeleteModule,
    ModalModule.forRoot(),
  ],
  declarations: [SaleActivityListComponent],
  exports: [SaleActivityListComponent],
})
export class SaleActivityListModule {}
