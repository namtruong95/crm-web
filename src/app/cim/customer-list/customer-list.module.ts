import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list.component';
import { CustomerService } from 'shared/services/customer.service';
import { NotifyService } from 'shared/utils/notify.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { CustomerModalDeleteModule } from '../customer-modal-delete/customer-modal-delete.module';
import { CustomerModalEditModule } from '../customer-modal-edit/customer-modal-edit.module';
import { CustomerModalAssignModule } from '../customer-modal-assign/customer-modal-assign.module';

@NgModule({
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    CustomerModalDeleteModule,
    CustomerModalEditModule,
    CustomerModalAssignModule,
  ],
  declarations: [CustomerListComponent],
  exports: [CustomerListComponent],
  providers: [CustomerService, NotifyService],
})
export class CustomerListModule {}
