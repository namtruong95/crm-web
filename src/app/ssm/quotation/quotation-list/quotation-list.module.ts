import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationListComponent } from './quotation-list.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { QuotationService } from 'shared/services/quotation.service';

@NgModule({
  imports: [CommonModule, FormsModule, ModalModule.forRoot(), PaginationModule.forRoot()],
  declarations: [QuotationListComponent],
  exports: [QuotationListComponent],
  providers: [QuotationService],
})
export class QuotationListModule {}
