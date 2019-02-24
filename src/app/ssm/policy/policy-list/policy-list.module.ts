import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyListComponent } from './policy-list.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { PolicyModalEditModule } from '../policy-modal-edit/policy-modal-edit.module';
import { PolicyModalDeleteModule } from '../policy-modal-delete/policy-modal-delete.module';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    PolicyModalEditModule,
    PolicyModalDeleteModule,
  ],
  declarations: [PolicyListComponent],
  exports: [PolicyListComponent],
})
export class PolicyListModule {}
