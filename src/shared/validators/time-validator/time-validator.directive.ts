import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appTimeValidator][formControlName],[appTimeValidator][formControl],[appTimeValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeValidatorDirective),
      multi: true,
    },
  ],
})
export class TimeValidatorDirective {
  private timeRegExp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  constructor() {}

  validate(c: AbstractControl): { [key: string]: any } {
    const value = c.value;

    if (!!value && !this.timeRegExp.test(value)) {
      return { appTimeValidator: true };
    }

    return null;
  }
}
