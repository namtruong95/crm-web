import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineEventComponent } from './timeline-event.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TimelineEventComponent],
  exports: [TimelineEventComponent],
})
export class TimelineEventModule {}
