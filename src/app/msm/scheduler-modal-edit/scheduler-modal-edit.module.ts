import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerModalEditComponent } from './scheduler-modal-edit.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimePickerModule } from 'shared/time-picker/time-picker.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { StaffService } from 'shared/services/staff.service';
import { UserService } from 'shared/services/user.service';
import { TimeValidatorModule } from 'shared/validators/time-validator/time-validator.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    TimePickerModule,
    NgSelectModule,
    TimeValidatorModule,
  ],
  declarations: [SchedulerModalEditComponent],
  exports: [SchedulerModalEditComponent],
  entryComponents: [SchedulerModalEditComponent],
  providers: [CustomerClassificationService, StaffService, UserService],
})
export class SchedulerModalEditModule {}
