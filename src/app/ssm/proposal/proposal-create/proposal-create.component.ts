import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/internal/observable/of';
import { Customer } from 'models/customer';
import { concat } from 'rxjs/internal/observable/concat';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CustomerService } from 'shared/services/customer.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { NotifyService } from 'shared/utils/notify.service';
import { Proposal } from 'models/proposal';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-proposal-create',
  templateUrl: './proposal-create.component.html',
  styleUrls: ['./proposal-create.component.scss'],
})
export class ProposalCreateComponent implements OnInit {
  public proposal: Proposal = new Proposal();

  public customers: Observable<Customer[]> = of([]);
  public customerInput$ = new Subject<string>();
  public isLoadingCusotmer = false;

  constructor(
    private _customerSv: CustomerService,
    private _emitter: EventEmitterService,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {
    this.proposal.customer = null;
    this._searchCustomers();
  }

  private _searchCustomers() {
    this.customers = concat(
      of([]), // default items
      this.customerInput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.isLoadingCusotmer = true)),
        switchMap((term) =>
          this._customerSv
            .searchCustomers({
              page: 0,
              size: 100,
              sort: 'asc',
              column: 'id',
              txtSearch: term,
            })
            .pipe(
              catchError(() => of([])), // empty list on error
              tap(() => (this.isLoadingCusotmer = false)),
            ),
        ),
      ),
    );
  }

  public createProposal(form: NgForm) {
    form.form.markAsPristine({ onlySelf: false });
  }
}
