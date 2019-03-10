import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyComponent } from './policy.component';
import { Routes, RouterModule } from '@angular/router';
import { PolicyListModule } from './policy-list/policy-list.module';
import { PolicyService } from 'shared/services/policy.service';
const routes: Routes = [
  {
    path: '',
    component: PolicyComponent,
    children: [
      {
        path: 'filters',
        loadChildren: './policy-filter/policy-filter.module#PolicyFilterModule',
      },
      {
        path: 'create',
        loadChildren: './policy-create/policy-create.module#PolicyCreateModule',
      },
      {
        path: 'folders',
        loadChildren: './policy-manage-folder/policy-manage-folder.module#PolicyManageFolderModule',
      },
      {
        path: 'folders/:id',
        loadChildren: './policy-manage-pdf/policy-manage-pdf.module#PolicyManagePdfModule',
      },
      {
        path: '',
        redirectTo: 'filters',
        pathMatch: 'full',
      },
    ],
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PolicyListModule],
  declarations: [PolicyComponent],
  providers: [PolicyService],
})
export class PolicyModule {}
