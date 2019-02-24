import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotifyService {
  constructor(private toastrService: ToastrService) {}

  public success(message: string, title?: string) {
    return this.toastrService.success(this._renderText(message), title);
  }

  public error(errors: any, title?: string) {
    let msg: string;
    if (!errors) {
      return;
    }

    if (errors.constructor === String) {
      msg = errors;
    } else {
      if (errors.error && errors.error.meta) {
        msg = errors.error.meta.message;
      } else {
        msg = errors.message;
      }
    }
    if (msg) {
      this.toastrService.error(this._renderText(msg), title);
    }
  }

  public info(message: string, title?: string) {
    return this.toastrService.info(this._renderText(message), title);
  }

  public warning(message: string, title?: string) {
    return this.toastrService.warning(this._renderText(message), title);
  }

  public clear() {
    this.toastrService.clear();
  }

  private _renderText(s: string): string {
    return s.replace('\n', '<br>');
  }
}
