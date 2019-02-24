import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcmFilterComponent } from './ccm-filter.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CareActivityService } from 'shared/services/care-activity.service';
const routes: Routes = [
  {
    path: '',
    component: CcmFilterComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, NgSelectModule, BsDatepickerModule.forRoot()],
  declarations: [CcmFilterComponent],
  providers: [CareActivityService],
})
export class CcmFilterModule {}
