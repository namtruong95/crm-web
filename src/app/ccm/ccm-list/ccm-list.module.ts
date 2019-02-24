import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcmListComponent } from './ccm-list.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { CareActivityService } from 'shared/services/care-activity.service';
import { CcmModalDeleteModule } from '../ccm-modal-delete/ccm-modal-delete.module';
import { CcmModalEditModule } from '../ccm-modal-edit/ccm-modal-edit.module';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    CcmModalDeleteModule,
    CcmModalEditModule,
  ],
  declarations: [CcmListComponent],
  exports: [CcmListComponent],
  providers: [CareActivityService],
})
export class CcmListModule {}
