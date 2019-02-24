import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtsListComponent } from './bts-list.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BtsService } from 'shared/services/bts.service';
import { BtsModalDeleteModule } from '../bts-modal-delete/bts-modal-delete.module';
import { BtsModalEditModule } from '../bts-modal-edit/bts-modal-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    BtsModalDeleteModule,
    BtsModalEditModule,
  ],
  declarations: [BtsListComponent],
  exports: [BtsListComponent],
  providers: [BtsService],
})
export class BtsListModule {}
