import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyModalCeFolderComponent } from './policy-modal-ce-folder.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [PolicyModalCeFolderComponent],
  entryComponents: [PolicyModalCeFolderComponent],
  exports: [PolicyModalCeFolderComponent],
})
export class PolicyModalCeFolderModule {}
