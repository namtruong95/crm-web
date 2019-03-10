import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineListComponent } from './timeline-list.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { SaleActivityService } from 'shared/services/sale-activity.service';
import { TimelineModalDeleteModule } from '../timeline-modal-delete/timeline-modal-delete.module';
import { TimelineModalEditModule } from '../timeline-modal-edit/timeline-modal-edit.module';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    TimelineModalDeleteModule,
    TimelineModalEditModule,
  ],
  declarations: [TimelineListComponent],
  exports: [TimelineListComponent],
  providers: [SaleActivityService],
})
export class TimelineListModule {}
