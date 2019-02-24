import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CustomerFilterComponent } from './customer-filter.component';
import { CustomerService } from 'shared/services/customer.service';

const routes: Routes = [
  {
    path: '',
    component: CustomerFilterComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), NgSelectModule, FormsModule, BsDatepickerModule.forRoot()],
  declarations: [CustomerFilterComponent],
  providers: [CustomerService],
})
export class CustomerFilterModule {}
