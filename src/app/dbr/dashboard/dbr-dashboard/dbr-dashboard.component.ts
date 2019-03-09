import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from 'shared/services/dashboard.service';
import { NotifyService } from 'shared/utils/notify.service';
import { Subscription } from 'rxjs/Subscription';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';

@Component({
  selector: 'app-dbr-dashboard',
  templateUrl: './dbr-dashboard.component.html',
  styleUrls: ['./dbr-dashboard.component.scss'],
})
export class DbrDashboardComponent implements OnInit, OnDestroy {
  public dashboard: any;
  private _subscriber: Subscription;
  private _filterQuery: any = {};

  constructor(
    private _dashboardSv: DashboardService,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
  ) {}

  ngOnInit() {
    this._getDashboard();
    this._onEventEmitter();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {
      if (data && data.type === EMITTER_TYPE.FILTER_DASHBOARD) {
        this._filterQuery = data.params;
        this._getDashboard();
      }
    });
  }

  private _getDashboard() {
    const params = {
      ...this._filterQuery,
    };

    this._dashboardSv.getDashboard(params).subscribe(
      (res) => {
        this.dashboard = res;
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }
}
