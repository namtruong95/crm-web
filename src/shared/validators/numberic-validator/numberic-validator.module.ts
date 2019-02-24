import { NgModule } from '@angular/core';
import { NumbericValidatorDirective } from './numberic-validator.directive';

@NgModule({
  declarations: [NumbericValidatorDirective],
  exports: [NumbericValidatorDirective],
})
export class NumbericValidatorModule {}
