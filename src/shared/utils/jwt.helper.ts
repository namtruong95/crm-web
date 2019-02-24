import { JwtHelperService } from '@auth0/angular-jwt';

export class JwtHelper {
  private static _helper = new JwtHelperService();

  static decodeToken(token: string) {
    return this._helper.decodeToken(token);
  }

  static getTokenExpirationDate(token: string) {
    return this._helper.getTokenExpirationDate(token);
  }

  static isTokenExpired(token: string) {
    return this._helper.isTokenExpired(token);
  }
}
