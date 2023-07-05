import {
  createDateWithoutTimezoneOffset,
  dateStringHasTimeComponent,
} from './dates';

describe('createDateWithoutTimezoneOffset', () => {
  it('should return a new Date instance without timezone offset for number input', () => {
    const input = 1623247200000; // June 9, 2021 00:00:00 UTC
    const result = createDateWithoutTimezoneOffset(input);
    const expected = new Date(input);

    expect(result).toEqual(expected);
    expect(result).not.toBe(expected); // Ensure a new Date instance is returned
  });

  it('should return a new Date instance without timezone offset for Date input', () => {
    const input = new Date('2021-06-09T00:00:00Z');
    const result = createDateWithoutTimezoneOffset(input);
    const expected = new Date(input.getTime());

    expect(result).toEqual(expected);
    expect(result).not.toBe(expected); // Ensure a new Date instance is returned
  });

  it('should return a new Date instance with timezone offset adjustment for string input without time', () => {
    const input = '2021-06-09'; // June 9, 2021 00:00:00 local time
    const result = createDateWithoutTimezoneOffset(input);
    const expected = new Date('2021-06-09T00:00:00Z');
    expected.setMinutes(expected.getMinutes() + expected.getTimezoneOffset());

    expect(result).toEqual(expected);
  });

  it('should return the original Date instance for string input with time', () => {
    const input = '2021-06-09T12:34:56Z'; // June 9, 2021 12:34:56 UTC
    const result = createDateWithoutTimezoneOffset(input);
    const expected = new Date(input);

    expect(result).toEqual(expected);
  });
});

describe('dateStringHasTimeComponent', () => {
  it('should return true for a valid date string with time component', () => {
    const dateString = '2023-07-05 12:34';
    const hasTimeComponent = dateStringHasTimeComponent(dateString);
    expect(hasTimeComponent).toBe(true);
  });

  it('should return false for a valid date string without time component', () => {
    const dateString = '2023-07-05';
    const hasTimeComponent = dateStringHasTimeComponent(dateString);
    expect(hasTimeComponent).toBe(false);
  });

  it('should return false for an invalid date string', () => {
    const dateString = '2023-07-05T12:34:56Z';
    const hasTimeComponent = dateStringHasTimeComponent(dateString);
    expect(hasTimeComponent).toBe(true);
  });
});
