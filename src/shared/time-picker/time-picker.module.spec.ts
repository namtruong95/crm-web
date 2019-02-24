import { TimePickerModule } from './time-picker.module';

describe('TimePickerModule', () => {
  let timePickerModule: TimePickerModule;

  beforeEach(() => {
    timePickerModule = new TimePickerModule();
  });

  it('should create an instance', () => {
    expect(timePickerModule).toBeTruthy();
  });
});
