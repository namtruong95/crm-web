import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationCreateComponent } from './quotation-create.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BtsService } from 'shared/services/bts.service';
import { PolicyService } from 'shared/services/policy.service';
import { UserService } from 'shared/services/user.service';
import { NumbericValidatorModule } from 'shared/validators/numberic-validator/numberic-validator.module';

const routes: Routes = [
  {
    path: '',
    component: QuotationCreateComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, NgSelectModule, NumbericValidatorModule],
  declarations: [QuotationCreateComponent],
  providers: [BtsService, PolicyService, UserService],
})
export class QuotationCreateModule {}
