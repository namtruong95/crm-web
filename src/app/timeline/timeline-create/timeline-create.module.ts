import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineCreateComponent } from './timeline-create.component';

import { Routes, RouterModule } from '@angular/router';
import { CustomerService } from 'shared/services/customer.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SaleActivityService } from 'shared/services/sale-activity.service';

const routes: Routes = [
  {
    path: '',
    component: TimelineCreateComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), NgSelectModule, FormsModule, BsDatepickerModule.forRoot()],
  declarations: [TimelineCreateComponent],
  providers: [CustomerService, SaleActivityService],
})
export class TimelineCreateModule {}
