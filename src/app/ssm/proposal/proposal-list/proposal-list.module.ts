import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListComponent } from './proposal-list.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { QuotationService } from 'shared/services/quotation.service';
import { ProposalService } from 'shared/services/proposal.service';

@NgModule({
  imports: [CommonModule, FormsModule, PaginationModule.forRoot()],
  declarations: [ProposalListComponent],
  exports: [ProposalListComponent],
  providers: [QuotationService, ProposalService],
})
export class ProposalListModule {}
