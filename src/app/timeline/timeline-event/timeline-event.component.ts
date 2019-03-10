import { Component, OnInit, Input } from '@angular/core';
import { SaleActivity } from 'models/sale-activity';

@Component({
  selector: 'app-timeline-event',
  templateUrl: './timeline-event.component.html',
  styleUrls: ['./timeline-event.component.scss'],
})
export class TimelineEventComponent implements OnInit {
  @Input('event')
  public event: SaleActivity;

  constructor() {}

  ngOnInit() {}
}
