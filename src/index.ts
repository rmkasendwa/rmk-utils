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
      if (object[key] && typeof object[key] === 'object') {
        (accumulator as any)[key] = removeNullValues(object[key]);
      } else if (Array.isArray(object[key])) {
        (accumulator as any)[key] = object[key].map((item: any) => {
          if (item && typeof item === 'object') {
            return removeNullValues(item);
          }
          return item;
        });
      } else {
        (accumulator as any)[key] = object[key];
      }
      return accumulator;
    }, {} as T);
};
