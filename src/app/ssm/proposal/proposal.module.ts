import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalComponent } from './proposal.component';
import { Routes, RouterModule } from '@angular/router';
import { ProposalListModule } from './proposal-list/proposal-list.module';

const routes: Routes = [
  {
    path: '',
    component: ProposalComponent,
    children: [
      {
        path: '',
        loadChildren: './proposal-filter/proposal-filter.module#ProposalFilterModule',
      },
      // {
      //   path: 'create',
      //   loadChildren: '.\/proposal-create\/proposal-create.module#ProposalCreateModule',
      // },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ProposalListModule],
  declarations: [ProposalComponent],
})
export class ProposalModule {}
