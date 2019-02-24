import { Component, OnInit, HostListener, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Timer } from './timer.model';

const noop = () => {};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimePickerComponent),
  multi: true,
};

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class TimePickerComponent implements OnInit, ControlValueAccessor {
  private _step = '1';
  @Input('step')
  public get step(): string {
    return this._step;
  }
  public set step(v: string) {
    this._step = v;
  }
  public get step_number(): number {
    return +this.step;
  }

  private _minTime = '00:00';
  @Input('minTime')
  public get minTime(): string {
    return this._minTime;
  }
  public set minTime(v: string) {
    this._minTime = v;
  }
  public get minTimeNumber(): number {
    const t = this.minTime.split(':');
    return +t[0] * 60 + +t[1];
  }

  private _maxTime = '24:00';
  @Input('maxTime')
  public get maxTime(): string {
    return this._maxTime;
  }
  public set maxTime(v: string) {
    this._maxTime = v;
  }
  public get maxTimeNumber(): number {
    const t = this.maxTime.split(':');
    return +t[0] * 60 + +t[1];
  }

  /**
   * Overriden for interface ControlValueAccessor
   */
  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (_: any) => void = noop;

  private _timer: Timer = new Timer();
  public get timer(): Timer {
    return this._timer;
  }
  public set timer(v: Timer) {
    this._timer = v;
  }

  private _selectedTime: string;
  public get selectedTime(): string {
    return this._selectedTime;
  }
  public set selectedTime(v: string) {
    this._selectedTime = v;
    this._onChangeCallback(v);
  }

  public isShow = false;

  constructor() {}

  ngOnInit() {}

  @HostListener('document:click', ['$event'])
  clickedOutside($event) {
    this.isShow = false;
  }
  public showTimepicker($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.isShow = true;
  }

  public onTouched() {
    this._onTouchedCallback();
  }

  public writeValue(value: any) {
    this.selectedTime = value;
    this.timer.setTime(value);
  }

  public registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  public setHour(key: string) {
    switch (key) {
      case 'up':
        this.timer.hour++;
        this.updateTime();
        break;
      case 'down':
        this.timer.hour--;
        this.updateTime();
        break;
    }
  }

  public setMinute(key: string) {
    switch (key) {
      case 'up':
        this.timer.minute += this.step_number;
        if (this.timer.minute >= 60) {
          this.timer.minute -= 60;
          this.timer.hour++;
        }
        this.updateTime();
        break;
      case 'down':
        this.timer.minute -= this.step_number;
        if (this.timer.minute < 0) {
          this.timer.hour--;
          this.timer.minute += 60;
        }
        this.updateTime();
        break;
    }
  }

  public updateTime() {
    if (this.timer.timeToMinute === this.maxTimeNumber) {
      this.timer.hour = Math.floor(this.minTimeNumber / 60);
      this.timer.minute = this.minTimeNumber % 60;
    }
    if (this.timer.timeToMinute > this.maxTimeNumber) {
      const t = this.minTimeNumber + this.timer.timeToMinute - this.maxTimeNumber;
      this.timer.hour = Math.floor(t / 60);
      this.timer.minute = t % 60;
    }
    if (this.timer.timeToMinute < this.minTimeNumber) {
      const t = this.maxTimeNumber - this.minTimeNumber + this.timer.timeToMinute;
      this.timer.hour = Math.floor(t / 60);
      this.timer.minute = t % 60;
    }

    this.selectedTime = this.timer.time;
  }
}
