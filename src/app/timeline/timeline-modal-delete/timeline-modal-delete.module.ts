import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModalDeleteComponent } from './timeline-modal-delete.component';
import { SaleActivityService } from 'shared/services/sale-activity.service';

@NgModule({
  imports: [CommonModule],
  declarations: [TimelineModalDeleteComponent],
  exports: [TimelineModalDeleteComponent],
  entryComponents: [TimelineModalDeleteComponent],
  providers: [SaleActivityService],
})
export class TimelineModalDeleteModule {}
