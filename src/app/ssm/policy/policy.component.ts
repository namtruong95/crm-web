import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { RoleService } from 'app/role.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
})
export class PolicyComponent implements OnInit, OnDestroy {
  private subscriber: Subscription;
  private subscriberRouter: Subscription;
  public isHiddenList = false;

  public folderName: string;

  get canHandlePolicy(): boolean {
    return this._role.is_admin || this._role.is_sale_director;
  }

  constructor(private router: Router, private _emitter: EventEmitterService, private _role: RoleService) {
    this.subscriberRouter = this.router.events.subscribe((res: NavigationEnd) => {
      if (res instanceof NavigationEnd) {
        this.isHiddenList = res.url.indexOf('/ssm/policy/folders') >= 0;
        this.folderName = '';
      }
    });
  }

  ngOnInit() {
    this._onEventEmitter();
  }

  private _onEventEmitter() {
    this.subscriber = this._emitter.caseNumber$.subscribe((res) => {
      if (res.type === EMITTER_TYPE.CHANGE_FOLDER) {
        this.folderName = res.data;
      }
    });
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
    this.subscriberRouter.unsubscribe();
  }
}
