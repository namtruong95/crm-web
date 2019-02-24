import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

interface DataEmitter {
  type: string;
  data?: any;
  params?: any;
  mode?: string;
}
@Injectable()
export class EventEmitterService {
  // Observable string sources
  private caseNumber = new Subject<any>();

  // Observable string streams
  public caseNumber$ = this.caseNumber;

  // Service message commands
  publishData(data: DataEmitter) {
    this.caseNumber.next(data);
  }
}
