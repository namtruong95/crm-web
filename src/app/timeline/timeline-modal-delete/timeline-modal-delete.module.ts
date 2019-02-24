import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModalDeleteComponent } from './timeline-modal-delete.component';
import { SaleActivity2Service } from 'shared/services/sale-activity-2.service';

@NgModule({
  imports: [CommonModule],
  declarations: [TimelineModalDeleteComponent],
  exports: [TimelineModalDeleteComponent],
  entryComponents: [TimelineModalDeleteComponent],
  providers: [SaleActivity2Service],
})
export class TimelineModalDeleteModule {}
