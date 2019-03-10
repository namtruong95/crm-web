import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationListComponent } from './quotation-list.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { QuotationService } from 'shared/services/quotation.service';
import { NoDblClickModule } from 'shared/utils/no-dbl-click/no-dbl-click.module';

@NgModule({
  imports: [CommonModule, FormsModule, ModalModule.forRoot(), PaginationModule.forRoot(), NoDblClickModule],
  declarations: [QuotationListComponent],
  exports: [QuotationListComponent],
  providers: [QuotationService],
})
export class QuotationListModule {}
