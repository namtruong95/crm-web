import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerFilterComponent } from './scheduler-filter.component';
import { Routes, RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
const routes: Routes = [
  {
    path: '',
    component: SchedulerFilterComponent,
  },
];
@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), BsDatepickerModule.forRoot(), NgSelectModule],
  declarations: [SchedulerFilterComponent],
})
export class SchedulerFilterModule {}
