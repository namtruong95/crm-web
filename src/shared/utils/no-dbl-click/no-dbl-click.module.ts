import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoDblClickDirective } from './no-dbl-click.directive';
import { BtnDblClickDirective } from './btn-dbl-click.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [NoDblClickDirective, BtnDblClickDirective],
  exports: [NoDblClickDirective, BtnDblClickDirective],
})
export class NoDblClickModule {}
