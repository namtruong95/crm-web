import { Directive, forwardRef, Attribute, HostListener, ElementRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector:
    '[appNumbericValidator][formControlName],[appNumbericValidator][formControl],[appNumbericValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumbericValidatorDirective),
      multi: true,
    },
  ],
})
export class NumbericValidatorDirective implements Validator {
  private isSelectAll = false;
  private regexNumeric = /^[0-9]+([\.]?[0-9]+)?$/;

  constructor(@Attribute('min') private min: number, @Attribute('max') private max: number, private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
    const e = <KeyboardEvent>event;

    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }

    const value: string = this.isSelectAll ? e.key : this.el.nativeElement.value + e.key;

    if (
      this.regexNumeric.test(value) ||
      (e.key === '.' && value.length >= 2 && (value.match(/\./g) || []).length <= 1)
    ) {
      this.isSelectAll = false;
      return;
    }

    e.preventDefault();
  }

  @HostListener('select')
  onselect() {
    this.isSelectAll = true;
  }
  @HostListener('click')
  onclick() {
    this.isSelectAll = false;
  }
  @HostListener('blur')
  onblur() {
    this.isSelectAll = false;
  }

  validate(c: AbstractControl): { [key: string]: any } {
    const value = c.value;

    if (
      (value !== null || value !== undefined) &&
      (isNaN(value) || (this.min && value < +this.min) || (this.max && value > +this.max))
    ) {
      return { appNumbericValidator: true };
    }

    return null;
  }
}
