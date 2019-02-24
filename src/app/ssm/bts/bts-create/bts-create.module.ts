import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtsCreateComponent } from './bts-create.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BtsService } from 'shared/services/bts.service';

const routes: Routes = [
  {
    path: '',
    component: BtsCreateComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
  declarations: [BtsCreateComponent],
  providers: [BtsService],
})
export class BtsCreateModule {}
