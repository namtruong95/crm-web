import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcmModalEditComponent } from './ccm-modal-edit.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UserService } from 'shared/services/user.service';

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, BsDatepickerModule.forRoot()],
  declarations: [CcmModalEditComponent],
  entryComponents: [CcmModalEditComponent],
  exports: [CcmModalEditComponent],
  providers: [UserService],
})
export class CcmModalEditModule {}
