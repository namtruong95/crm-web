import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoDblClick]',
})
export class NoDblClickDirective {
  constructor() {}

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.srcElement.parentElement.setAttribute('disabled', true);
    event.srcElement.parentElement.classList.add('disabled');
    setTimeout(() => {
      event.srcElement.parentElement.removeAttribute('disabled');
      event.srcElement.parentElement.classList.remove('disabled');
    }, 500);
  }
}
