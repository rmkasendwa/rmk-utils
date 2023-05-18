/**
 * Removes null/undefined values from an object.
 *
 * @param object The object with null values.
 * @returns New object without null values.
 */
export const removeNullValues = (obj: any): any => {
  if (typeof obj !== 'object' || obj == null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeNullValues).filter((value) => value != null);
  }

  const result: any = {};

  for (const key in obj) {
    const value = removeNullValues(obj[key]);
    if (value != null) {
      result[key] = value;
    }
  }

  return result;
};
