import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationModalEditComponent } from './quotation-modal-edit.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { QuotationMapModule } from '../quotation-map/quotation-map.module';
import { UserService } from 'shared/services/user.service';
import { NumbericValidatorModule } from 'shared/validators/numberic-validator/numberic-validator.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ModalModule.forRoot(),
    QuotationMapModule,
    NumbericValidatorModule,
  ],
  declarations: [QuotationModalEditComponent],
  entryComponents: [QuotationModalEditComponent],
  exports: [QuotationModalEditComponent],
  providers: [UserService],
})
export class QuotationModalEditModule {}
