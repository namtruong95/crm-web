import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcmComponent } from './ccm.component';
import { RouterModule, Routes } from '@angular/router';
import { CcmListModule } from './ccm-list/ccm-list.module';
import { CcmService } from './ccm.service';

const routes: Routes = [
  {
    path: '',
    component: CcmComponent,
    children: [
      {
        path: 'filters',
        loadChildren: './ccm-filter/ccm-filter.module#CcmFilterModule',
      },
      {
        path: 'create',
        loadChildren: './ccm-create/ccm-create.module#CcmCreateModule',
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
  imports: [CommonModule, RouterModule.forChild(routes), CcmListModule],
  declarations: [CcmComponent],
  providers: [CcmService],
})
export class CcmModule {}
