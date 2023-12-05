import { formatBytes } from './bytes';

/**
 * Calculates the difference between two objects, representing changes made in the `updatedData`
 * compared to the `originalData`. Changes in both directions are included in the output.
 *
 * If a key is present in `originalData` but missing in `updatedData`, it will be set to `null` in the output.
 *
 * @param updatedData - The updated object containing the modified data.
 * @param originalData - The original object representing the baseline data.
 * @returns An object representing the differences between the two input objects.
 */
export const diff = (updatedData: any, originalData: any) => {
  const isEmptyObject = (obj: any) =>
    obj && Object.keys(obj).length === 0 && obj.constructor === Object;

  const isObject = (value: any) =>
    value !== null && typeof value === 'object' && !Array.isArray(value);

  const recursiveDiff = (nestedUpdatedData: any, nestedOriginalData: any) => {
    const result: any = {};

    for (const key in nestedOriginalData) {
      if (
        isObject(nestedOriginalData[key]) &&
        isObject(nestedUpdatedData[key])
      ) {
        const nestedDiff = recursiveDiff(
          nestedUpdatedData[key],
          nestedOriginalData[key]
        );
        if (!isEmptyObject(nestedDiff)) {
          result[key] = nestedDiff;
        }
      } else if (!(key in nestedUpdatedData)) {
        result[key] = null;
      } else if (nestedUpdatedData[key] !== nestedOriginalData[key]) {
        result[key] = nestedUpdatedData[key];
      }
    }

    return result;
  };

  const dataDiff: any = {};

  // Check for differences and missing keys in updatedData.
  for (const key in originalData) {
    if (isObject(originalData?.[key]) && isObject(updatedData?.[key])) {
      const nestedDiff = recursiveDiff(updatedData[key], originalData[key]);
      if (!isEmptyObject(nestedDiff)) {
        dataDiff[key] = nestedDiff;
      }
    } else if (!(key in updatedData)) {
      dataDiff[key] = null;
    } else if (originalData?.[key] !== updatedData?.[key]) {
      dataDiff[key] = updatedData?.[key];
    }
  }

  // Check for keys in updatedData that are not present in originalData.
  for (const key in updatedData) {
    if (!(key in originalData)) {
      dataDiff[key] = updatedData[key];
    }
  }

  return dataDiff;
};

export const getMemorySize = (object: any, formatted = false) => {
  let bytes = 0;
  if (object !== null && object !== undefined) {
    switch (typeof object) {
      case 'number':
        bytes += 8;
        break;
      case 'string':
        bytes += object.length * 2;
        break;
      case 'boolean':
        bytes += 4;
        break;
      case 'object':
        const objectClass = Object.prototype.toString.call(object).slice(8, -1);
        if (objectClass === 'Object' || objectClass === 'Array') {
          for (const key in object) {
            if (!object.hasOwnProperty(key)) continue;
            bytes += getMemorySize(object[key]) as number;
          }
        } else {
          bytes += object.toString().length * 2;
        }
        break;
    }
  }
  return formatted ? formatBytes(bytes) : bytes;
};

export const parseCSV = (csvData: string, delimiter = ',') => {
  const lines = csvData.split('\n');
  const headers = lines[0].split(delimiter);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '') continue; // Skip empty lines

    const values = [];
    let currentField = '';
    let insideQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === delimiter && !insideQuotes) {
        values.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }

    values.push(currentField.trim());

    const row: any = {};

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j].trim();
      const value = values[j] ? values[j].trim() : '';

      row[header] = value;
    }

    rows.push(row);
  }

  return rows;
};
