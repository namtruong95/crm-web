import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyFilterComponent } from './policy-filter.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { PolicyService } from 'shared/services/policy.service';

const routes: Routes = [
  {
    path: '',
    component: PolicyFilterComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, NgSelectModule],
  declarations: [PolicyFilterComponent],
  providers: [CustomerClassificationService, PolicyService],
})
export class PolicyFilterModule {}
