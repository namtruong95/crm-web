import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerCreateComponent } from './customer-create.component';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomerService } from 'shared/services/customer.service';
import { UserService } from 'shared/services/user.service';

const routes: Routes = [
  {
    path: '',
    component: CustomerCreateComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), NgSelectModule, FormsModule, BsDatepickerModule.forRoot()],
  declarations: [CustomerCreateComponent],
  providers: [CustomerService, UserService],
})
export class CustomerCreateModule {}
