import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtsFilterComponent } from './bts-filter.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BtsService } from 'shared/services/bts.service';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: BtsFilterComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, NgSelectModule],
  declarations: [BtsFilterComponent],
  providers: [BtsService],
})
export class BtsFilterModule {}
