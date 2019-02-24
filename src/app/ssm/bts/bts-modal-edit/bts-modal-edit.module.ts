import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtsModalEditComponent } from './bts-modal-edit.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [CommonModule, FormsModule, ModalModule.forRoot()],
  declarations: [BtsModalEditComponent],
  entryComponents: [BtsModalEditComponent],
  exports: [BtsModalEditComponent],
})
export class BtsModalEditModule {}
