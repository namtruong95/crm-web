import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { UserService } from 'shared/services/user.service';

@NgModule({
  imports: [CommonModule, PaginationModule.forRoot(), ModalModule.forRoot(), FormsModule],
  declarations: [UserListComponent],
  exports: [UserListComponent],
  providers: [UserService],
})
export class UserListModule {}
