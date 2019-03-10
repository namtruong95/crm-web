import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBtnDblClick]',
})
export class BtnDblClickDirective {
  constructor() {}

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.srcElement.setAttribute('disabled', true);
    event.srcElement.classList.add('disabled');
    setTimeout(() => {
      event.srcElement.removeAttribute('disabled');
      event.srcElement.classList.remove('disabled');
    }, 500);
  }
}
