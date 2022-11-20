/**
 * Removes null/undefined values from an object.
 *
 * @param object The object with null values.
 * @returns New object without null values.
 */
export const removeNullValues = <T extends Record<string, any>>(object: T) => {
  return Object.keys(object)
    .filter((key) => {
      return object[key] != null;
    })
    .reduce((accumulator, key) => {
      (accumulator as any)[key] = object[key];
      return accumulator;
    }, {} as T);
};
