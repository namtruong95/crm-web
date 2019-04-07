import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModalEditComponent } from './user-modal-edit.component';
import { FormsModule } from '@angular/forms';
import { UserService } from 'shared/services/user.service';
import { BranchService } from 'shared/services/branch.service';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule],
  declarations: [UserModalEditComponent],
  entryComponents: [UserModalEditComponent],
  exports: [UserModalEditComponent],
  providers: [UserService, BranchService],
})
export class UserModalEditModule {}
