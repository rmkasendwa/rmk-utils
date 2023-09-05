import { format } from 'date-fns';

//#region formatDate
const DEFAULT_DATE_FORMAT = 'dd MMM yyyy';

const DEFAULT_DATE_TIME_FORMAT = `dddd, ${DEFAULT_DATE_FORMAT} hh:mm aa`;

const DEFAULT_DATE_TIME_FORMAT_WITH_SECONDS = `dddd, ${DEFAULT_DATE_FORMAT} hh:mm:ss aa`;

/**
 * Formats a date value into a string representation based on the specified options.
 *
 * @param dateInput - The input value representing a date. It can be a string, number (timestamp), or a Date instance.
 * @param includeTime - (Optional) A boolean value indicating whether to include the time component in the formatted string. It can also be set to 'SECONDS' to include seconds.
 * @param dateFormat - (Optional) The format string to use for formatting the date. If not provided, a default format is used based on the `includeTime` option.
 * @returns A formatted string representation of the date, or an empty string if the input is invalid or cannot be formatted.
 *
 * @remarks
 * If `includeTime` is not provided or set to `false`, only the date component is included in the formatted string.
 * If `includeTime` is set to `true`, the formatted string includes the date and time components.
 * If `includeTime` is set to `'SECONDS'`, the formatted string includes the date, time, and seconds components.
 *
 * The `dateFormat` parameter allows customization of the format string used for formatting the date. If not provided, a default format is used based on the `includeTime` option.
 *
 * The function supports three types of inputs: string, number (timestamp), and Date instance.
 *
 * - For a string input, if it is a valid number, it is parsed as a timestamp. Otherwise, it is treated as a date string.
 * - For a number input, it is treated as a timestamp.
 * - For a Date instance input, it is used as is.
 *
 * The function uses the `createDateWithoutTimezoneOffset` function to handle timezone offsets and ensure consistent formatting.
 *
 * @example
 * // Format date without time
 * const result = formatDate('2021-06-09');
 * // Returns: 'June 9, 2021'
 *
 * @example
 * // Format date with time
 * const result = formatDate('2021-06-09', true);
 * // Returns: 'June 9, 2021 00:00 AM'
 *
 * @example
 * // Format date with time including seconds
 * const result = formatDate('2021-06-09', 'SECONDS');
 * // Returns: 'June 9, 2021 00:00:00 AM'
 *
 * @example
 * // Format date using custom format
 * const result = formatDate('2021-06-09', true, 'MM/dd/yyyy HH:mm');
 * // Returns: '06/09/2021 00:00'
 */
export const formatDate = (
  dateInput: string | number | Date,
  includeTime?: boolean | 'SECONDS',
  dateFormat?: string
) => {
  // Determine the date format based on the includeTime option
  dateFormat ??= (() => {
    if (includeTime === true) return DEFAULT_DATE_TIME_FORMAT;
    if (includeTime === 'SECONDS') return DEFAULT_DATE_TIME_FORMAT_WITH_SECONDS;
    return DEFAULT_DATE_FORMAT;
  })();

  // Handle Date instance input
  if (dateInput instanceof Date) {
    return format(dateInput, dateFormat);
  }

  // Parse string input if it is a valid number
  if (typeof dateInput === 'string' && dateInput.match(/^-?\d+$/)) {
    dateInput = parseInt(dateInput);
  }

  // Handle string and number inputs
  if (
    ['string', 'number'].includes(typeof dateInput) &&
    !isNaN(new Date(dateInput).getTime())
  ) {
    return format(createDateWithoutTimezoneOffset(dateInput), dateFormat);
  }

  return '';
};
//#endregion

//#region isIsoDate
/**
 * Checks if a string is in ISO 8601 date format.
 *
 * @param str - The string to be checked.
 * @returns A boolean indicating whether the string is in ISO 8601 date format.
 *
 * @remarks
 * The function verifies if the provided string matches the pattern `YYYY-MM-DDTHH:mm:ss.SSSZ`, which is the standard format defined by ISO 8601 for representing dates and times.
 * The function further validates if the string can be successfully parsed into a valid Date object and then converted back to the original string representation using the `toISOString` method.
 *
 * @example
 * const result = isIsoDate('2021-06-09T12:34:56.789Z');
 * // Returns: true
 *
 * @example
 * const result = isIsoDate('2021-06-09T12:34:56');
 * // Returns: false
 */
export const isIsoDate = (str: string) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) {
    return false;
  }
  return new Date(str).toISOString() === str;
};
//#endregion

//#region createDateWithoutTimezoneOffset
/**
 * Creates a new Date instance with the timezone offset applied or removed, based on the input.
 *
 * @param dateInput - The input value representing a date. It can be a string, number (timestamp), or a Date instance.
 * @returns A new Date instance with the timezone offset adjusted or removed.
 *
 * @remarks
 * If the `dateInput` is a number or a Date instance, the function returns a new Date instance without applying any timezone offset.
 *
 * If the `dateInput` is a string without a time component (e.g., '2021-06-09'), the function returns a new Date instance with the timezone offset adjustment based on the local time zone.
 *
 * If the `dateInput` is a string with a time component (e.g., '2021-06-09T12:34:56Z'), the function returns the original Date instance without applying any timezone offset.
 *
 * @example
 * // Number input
 * const result = createDateWithoutTimezoneOffset(1623247200000);
 * // Returns: A new Date instance equivalent to June 9, 2021 00:00:00 UTC
 *
 * @example
 * // Date input
 * const input = new Date('2021-06-09T00:00:00Z');
 * const result = createDateWithoutTimezoneOffset(input);
 * // Returns: A new Date instance equivalent to the input date without timezone offset
 *
 * @example
 * // String input without time
 * const result = createDateWithoutTimezoneOffset('2021-06-09');
 * // Returns: A new Date instance with the timezone offset adjustment based on the local time zone
 *
 * @example
 * // String input with time
 * const result = createDateWithoutTimezoneOffset('2021-06-09T12:34:56Z');
 * // Returns: The original Date instance without applying any timezone offset
 */
export const createDateWithoutTimezoneOffset = (
  dateInput: string | number | Date
) => {
  // Check if the input is a Date instance
  if (dateInput instanceof Date) {
    return new Date(dateInput.getTime());
  }

  // Check if the input is a number (timestamp)
  if (typeof dateInput === 'number') {
    return new Date(dateInput);
  }

  // Handle string input
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return date;
  }

  // Check if the date has no time component
  if (!dateInput.match(/\d{2}:\d{2}/) && !isIsoDate(dateInput)) {
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  }

  return date;
};
//#endregion

//#region dateStringHasTimeComponent
/**
 * Checks if a given date string contains a time component.
 *
 * @param {string} dateString - The date string to be checked.
 * @returns {boolean} - Returns true if the date string contains a time component, otherwise returns false.
 */
export const dateStringHasTimeComponent = (dateString: string) => {
  return dateString.match(/\d{2}:\d{2}/) != null;
};
//#endregion
