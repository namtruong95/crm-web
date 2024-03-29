import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import * as $ from 'jquery';
import 'fullcalendar';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SchedulerModalEditComponent } from '../scheduler-modal-edit/scheduler-modal-edit.component';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { CustomerSaleActivityService } from 'shared/services/customer-sale-activity.service';
import { CustomerSaleActivity } from 'models/customer-sale-activity';
import { Subscription } from 'rxjs/Subscription';
import { EMITTER_TYPE } from 'constants/emitter';

@Component({
  selector: 'app-scheduler-calendar',
  templateUrl: './scheduler-calendar.component.html',
  styleUrls: ['./scheduler-calendar.component.scss'],
})
export class SchedulerCalendarComponent implements OnInit, OnDestroy {
  private _calendarOptions: any;
  private _filterQuery: any = {};
  public saleActivities: CustomerSaleActivity[] = [];
  public _subscriber: Subscription;

  constructor(
    private _modalService: BsModalService,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _customerSaleActivitySv: CustomerSaleActivityService,
  ) {}

  ngOnInit() {
    this._initCalendar();
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (
        data &&
        (data.type === EMITTER_TYPE.CREATE_SALE_ACTIVITY ||
          data.type === EMITTER_TYPE.UPDATE_SALE_ACTIVITY ||
          data.type === EMITTER_TYPE.REMOVE_SALE_ACTIVITY)
      ) {
        this._reloadCalendar();
      }

      if (data && data.type === EMITTER_TYPE.FILTER_SALE_ACTIVITY) {
        this._filterQuery = data.params;
        this._reloadCalendar();
      }
    });
  }

  private _initCalendar() {
    this._calendarOptions = {
      eventLimit: true,
      header: {
        left: '',
        center: 'title',
        right: 'prev,next',
      },
      defaultView: 'month',
      defaultDate: moment().format('YYYY-MM-DD'),
      timezone: 'local',
      editable: false,
      eventDragStart: (event, jsEvent, ui, view) => {
        // console.log(event.start, 111);
      },
      eventDragStop: (event, jsEvent, ui, view) => {},
      eventDrop: (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) => {
        // console.log(event, 222);
      },
      dayClick: (date, jsEvent, view) => {},
      eventClick: (calEvent, jsEvent, view) => {
        const config = {
          class: 'modal-lg',
          initialState: {
            scheduler: new CustomerSaleActivity().deserialize(calEvent),
          },
        };

        this._openModal(SchedulerModalEditComponent, config);
      },
      eventRender: (event, element) => {},
      events: (start, end, timezone, callback) => {
        this._getSaleActivities(callback);
      },
      viewRender: (view, element) => {},
    };
    (<any>$('#SchedulerCalendar')).fullCalendar(this._calendarOptions);
  }

  private _getSaleActivities(callback: Function) {
    const params = {
      ...this._filterQuery,
    };

    this._customerSaleActivitySv.getSaleActivities(params).subscribe(
      (res) => {
        this.saleActivities = res.customerSaleActivityList;
        callback(this.saleActivities);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

  private _reloadCalendar() {
    (<any>$('#SchedulerCalendar')).fullCalendar('destroy');
    this._resetEvent();
    this._initCalendar();
  }

  private _resetEvent() {
    this.saleActivities = [];
  }

  private _openModal(comp, config?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((reason: string) => {
      subscribe.unsubscribe();
      if (reason === 'reload') {
        // handle reload calendar
      }
    });

    this._modalService.show(comp, config);
  }
}
