import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtsModalEditComponent } from './bts-modal-edit.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { BranchService } from 'shared/services/branch.service';

@NgModule({
  imports: [CommonModule, FormsModule, ModalModule.forRoot(), NgSelectModule],
  declarations: [BtsModalEditComponent],
  entryComponents: [BtsModalEditComponent],
  exports: [BtsModalEditComponent],
  providers: [BranchService],
})
export class BtsModalEditModule {}
