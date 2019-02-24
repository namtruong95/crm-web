import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyManagePdfComponent } from './policy-manage-pdf.component';
import { Routes, RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ManageFileService } from 'shared/services/manage-file.service';

const routes: Routes = [
  {
    path: '',
    component: PolicyManagePdfComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PaginationModule.forRoot(), FormsModule],
  declarations: [PolicyManagePdfComponent],
  providers: [ManageFileService],
})
export class PolicyManagePdfModule {}
