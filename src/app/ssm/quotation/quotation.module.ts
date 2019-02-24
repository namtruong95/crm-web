import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationComponent } from './quotation.component';
import { Routes, RouterModule } from '@angular/router';
import { QuotationListModule } from './quotation-list/quotation-list.module';
import { QuotationMapModule } from './quotation-map/quotation-map.module';
import { QuotationModalDeleteModule } from './quotation-modal-delete/quotation-modal-delete.module';
import { QuotationModalEditModule } from './quotation-modal-edit/quotation-modal-edit.module';

const routes: Routes = [
  {
    path: '',
    component: QuotationComponent,
    children: [
      {
        path: 'filters',
        loadChildren: './quotation-filter/quotation-filter.module#QuotationFilterModule',
      },
      {
        path: 'create',
        loadChildren: './quotation-create/quotation-create.module#QuotationCreateModule',
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
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    QuotationListModule,
    QuotationMapModule,
    QuotationModalDeleteModule,
    QuotationModalEditModule,
  ],
  declarations: [QuotationComponent],
})
export class QuotationModule {}
