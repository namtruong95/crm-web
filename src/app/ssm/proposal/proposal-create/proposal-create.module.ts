import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalCreateComponent } from './proposal-create.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: ProposalCreateComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, NgSelectModule],
  declarations: [ProposalCreateComponent],
})
export class ProposalCreateModule {}
