import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtsCreateComponent } from './bts-create.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BtsService } from 'shared/services/bts.service';
import { BranchService } from 'shared/services/branch.service';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: BtsCreateComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, NgSelectModule],
  declarations: [BtsCreateComponent],
  providers: [BtsService, BranchService],
})
export class BtsCreateModule {}
