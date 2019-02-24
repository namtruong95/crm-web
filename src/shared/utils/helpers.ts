import * as $ from 'jquery';

export class Helpers {
  static setLoading(enable) {
    const body = $('body');

    if (enable) {
      $(body).addClass('loading-non-block');
    } else {
      $(body).removeClass('loading-non-block');
    }
  }

  public static downloadFileFromUri(uri: string, name?: string) {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = uri;
    link.download = name || uri;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
