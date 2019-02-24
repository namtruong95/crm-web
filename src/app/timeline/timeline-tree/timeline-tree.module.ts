import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineTreeComponent } from './timeline-tree.component';
import { Routes, RouterModule } from '@angular/router';
import { TimelineEventModule } from '../timeline-event/timeline-event.module';
import { UserService } from 'shared/services/user.service';
import { CustomerService } from 'shared/services/customer.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const routes: Routes = [
  {
    path: '',
    component: TimelineTreeComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    TimelineEventModule,
    NgSelectModule,
    NgSelectModule,
    FormsModule,
  ],
  declarations: [TimelineTreeComponent],
  providers: [UserService, CustomerService],
})
export class TimelineTreeModule {}
