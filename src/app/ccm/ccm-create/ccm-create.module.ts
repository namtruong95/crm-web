import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcmCreateComponent } from './ccm-create.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { StaffService } from 'shared/services/staff.service';
import { UserService } from 'shared/services/user.service';
const routes: Routes = [
  {
    path: '',
    component: CcmCreateComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, NgSelectModule, BsDatepickerModule.forRoot()],
  declarations: [CcmCreateComponent],
  providers: [StaffService, UserService],
})
export class CcmCreateModule {}
