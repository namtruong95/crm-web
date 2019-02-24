import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyCreateComponent } from './policy-create.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { NumbericValidatorModule } from 'shared/validators/numberic-validator/numberic-validator.module';

const routes: Routes = [
  {
    path: '',
    component: PolicyCreateComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, NgSelectModule, NumbericValidatorModule],
  declarations: [PolicyCreateComponent],
  providers: [CustomerClassificationService],
})
export class PolicyCreateModule {}
