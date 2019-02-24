import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModalEditComponent } from './timeline-modal-edit.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomerService } from 'shared/services/customer.service';
import { SaleActivity2Service } from 'shared/services/sale-activity-2.service';

@NgModule({
  imports: [CommonModule, NgSelectModule, FormsModule, BsDatepickerModule.forRoot()],
  declarations: [TimelineModalEditComponent],
  entryComponents: [TimelineModalEditComponent],
  exports: [TimelineModalEditComponent],
  providers: [CustomerService, SaleActivity2Service],
})
export class TimelineModalEditModule {}
