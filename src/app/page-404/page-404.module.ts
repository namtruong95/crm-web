import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page404Component } from './page-404.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: Page404Component,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [Page404Component],
})
export class Page404Module {}
