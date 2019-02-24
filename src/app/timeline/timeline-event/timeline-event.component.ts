import { Component, OnInit, Input } from '@angular/core';
import { SaleActivity2 } from 'models/sale-activity-2';

@Component({
  selector: 'app-timeline-event',
  templateUrl: './timeline-event.component.html',
  styleUrls: ['./timeline-event.component.scss'],
})
export class TimelineEventComponent implements OnInit {
  @Input('event')
  public event: SaleActivity2;

  constructor() {}

  ngOnInit() {}
}
