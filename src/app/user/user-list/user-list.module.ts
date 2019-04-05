import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { UserService } from 'shared/services/user.service';
import { UserModalEditModule } from '../user-modal-edit/user-modal-edit.module';

@NgModule({
  imports: [CommonModule, PaginationModule.forRoot(), ModalModule.forRoot(), FormsModule, UserModalEditModule],
  declarations: [UserListComponent],
  exports: [UserListComponent],
  providers: [UserService],
})
export class UserListModule {}
