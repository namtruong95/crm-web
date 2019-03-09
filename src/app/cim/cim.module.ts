import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CimComponent } from './cim.component';

import { CustomerMapModule } from './customer-map/customer-map.module';
import { CustomerListModule } from './customer-list/customer-list.module';

import { RouterModule, Routes } from '@angular/router';
import { CimService } from './cim.service';
const routes: Routes = [
  {
    path: 'customer',
    component: CimComponent,
    children: [
      {
        path: 'filters',
        loadChildren: './customer-filter/customer-filter.module#CustomerFilterModule',
      },
      {
        path: 'create',
        loadChildren: './customer-create/customer-create.module#CustomerCreateModule',
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
  imports: [CommonModule, RouterModule.forChild(routes), CustomerMapModule, CustomerListModule],
  declarations: [CimComponent],
  providers: [CimService],
})
export class CimModule {}
