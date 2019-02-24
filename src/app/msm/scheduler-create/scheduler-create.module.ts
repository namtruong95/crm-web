import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerCreateComponent } from './scheduler-create.component';
import { Routes, RouterModule } from '@angular/router';
import { TimePickerModule } from 'shared/time-picker/time-picker.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { StaffService } from 'shared/services/staff.service';
import { UserService } from 'shared/services/user.service';
import { TimeValidatorModule } from 'shared/validators/time-validator/time-validator.module';

const routes: Routes = [
  {
    path: '',
    component: SchedulerCreateComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    TimePickerModule,
    NgSelectModule,
    TimeValidatorModule,
  ],
  declarations: [SchedulerCreateComponent],
  providers: [CustomerClassificationService, StaffService, UserService],
})
export class SchedulerCreateModule {}
