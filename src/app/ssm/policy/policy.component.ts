import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
})
export class PolicyComponent implements OnInit, OnDestroy {
  private subscriber: Subscription;
  public isHiddenList = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.subscriber = this.router.events.subscribe((res: NavigationEnd) => {
      if (res instanceof NavigationEnd) {
        this.isHiddenList = res.url === `/ssm/policy/pdf`;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
}
