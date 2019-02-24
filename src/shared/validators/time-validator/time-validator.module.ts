import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeValidatorDirective } from './time-validator.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TimeValidatorDirective],
  exports: [TimeValidatorDirective],
})
export class TimeValidatorModule {}
