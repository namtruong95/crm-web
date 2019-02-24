export class Timer {
  private _minute: number;
  public get minute(): number {
    return this._minute;
  }
  public set minute(v: number) {
    this._minute = v;
  }
  public get minute_display(): string {
    if (!this.minute) {
      return `00`;
    }
    return this.minute < 10 ? `0${this.minute}` : this.minute.toString();
  }

  private _hour: number;
  public get hour(): number {
    return this._hour;
  }
  public set hour(v: number) {
    this._hour = v;
  }
  public get hour_display(): string {
    if (!this.hour) {
      return `00`;
    }
    return this.hour < 10 ? `0${this.hour}` : this.hour.toString();
  }

  public get time(): string {
    return `${this.hour_display}:${this.minute_display}`;
  }

  public get timeToMinute(): number {
    return this.hour * 60 + this.minute;
  }

  constructor() {}

  /**
   * @param time HH:mm
   */
  public setTime(time: string) {
    if (time) {
      const t = time.split(':');
      this.hour = +t[0];
      this.minute = +t[1];
    }
  }
}
