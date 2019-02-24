import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsmComponent } from './ssm.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SsmComponent,
    children: [
      {
        path: 'policy',
        loadChildren: './policy/policy.module#PolicyModule',
      },
      {
        path: 'bts',
        loadChildren: './bts/bts.module#BtsModule',
      },
      {
        path: 'quotation',
        loadChildren: './quotation/quotation.module#QuotationModule',
      },
      {
        path: 'proposal',
        loadChildren: './proposal/proposal.module#ProposalModule',
      },
      {
        path: '',
        redirectTo: 'policy',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [SsmComponent],
})
export class SsmModule {}
