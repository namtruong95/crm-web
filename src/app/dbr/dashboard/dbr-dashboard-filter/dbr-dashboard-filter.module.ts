import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbrDashboardFilterComponent } from './dbr-dashboard-filter.component';
import { StaffService } from 'shared/services/staff.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UserService } from 'shared/services/user.service';

@NgModule({
  imports: [CommonModule, NgSelectModule, FormsModule, BsDatepickerModule.forRoot()],
  declarations: [DbrDashboardFilterComponent],
  exports: [DbrDashboardFilterComponent],
  providers: [StaffService, UserService],
})
export class DbrDashboardFilterModule {}
