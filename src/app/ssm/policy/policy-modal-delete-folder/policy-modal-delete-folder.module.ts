import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyModalDeleteFolderComponent } from './policy-modal-delete-folder.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PolicyModalDeleteFolderComponent],
  entryComponents: [PolicyModalDeleteFolderComponent],
  exports: [PolicyModalDeleteFolderComponent],
})
export class PolicyModalFolderDeleteModule {}
