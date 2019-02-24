import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalFilterComponent } from './proposal-filter.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Routes, RouterModule } from '@angular/router';
import { ProposalService } from 'shared/services/proposal.service';
import { NumbericValidatorModule } from 'shared/validators/numberic-validator/numberic-validator.module';

const routes: Routes = [
  {
    path: '',
    component: ProposalFilterComponent,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, RouterModule.forChild(routes), NumbericValidatorModule],
  declarations: [ProposalFilterComponent],
  providers: [ProposalService],
})
export class ProposalFilterModule {}
