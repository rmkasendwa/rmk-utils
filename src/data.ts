import { isEmpty, omitBy } from 'lodash';

import { formatBytes } from './bytes';

export const diff = (
  updatedData: any,
  originalData: any,
  biDirectional = false
) => {
  const dataDiff: any = omitBy(updatedData, (value, key) => {
    if (typeof originalData?.[key] === 'object') {
      const similar = isEmpty(diff(updatedData[key], originalData[key]));
      if (similar) return isEmpty(diff(originalData[key], updatedData[key]));
      return similar;
    }
    return originalData?.[key] === value;
  });
  if (biDirectional) {
    const mirrorDiff = diff(originalData, updatedData);
    for (const key in mirrorDiff) {
      if (!dataDiff?.[key] && mirrorDiff?.[key]) {
        dataDiff[key] = mirrorDiff[key];
      }
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
