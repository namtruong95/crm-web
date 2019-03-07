import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyManageFolderComponent } from './policy-manage-folder.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PolicyModalCeFolderModule } from '../policy-modal-ce-folder/policy-modal-ce-folder.module';
import { FolderService } from 'shared/services/folder.service';
import { PolicyModalFolderDeleteModule } from '../policy-modal-delete-folder/policy-modal-delete-folder.module';
const routes: Routes = [
  {
    path: '',
    component: PolicyManageFolderComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    PolicyModalCeFolderModule,
    PolicyModalFolderDeleteModule,
  ],
  declarations: [PolicyManageFolderComponent],
  providers: [FolderService],
})
export class PolicyManageFolderModule {}
