import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerModalAssignComponent } from './customer-modal-assign.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerMapModule } from '../customer-map/customer-map.module';
import { UserService } from 'shared/services/user.service';

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, BsDatepickerModule.forRoot(), CustomerMapModule],
  declarations: [CustomerModalAssignComponent],
  exports: [CustomerModalAssignComponent],
  entryComponents: [CustomerModalAssignComponent],
  providers: [UserService],
})
export class CustomerModalAssignModule {}
