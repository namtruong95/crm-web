import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyModalEditComponent } from './policy-modal-edit.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { NumbericValidatorModule } from 'shared/validators/numberic-validator/numberic-validator.module';

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, ModalModule.forRoot(), NumbericValidatorModule],
  declarations: [PolicyModalEditComponent],
  entryComponents: [PolicyModalEditComponent],
  exports: [PolicyModalEditComponent],
  providers: [CustomerClassificationService],
})
export class PolicyModalEditModule {}
