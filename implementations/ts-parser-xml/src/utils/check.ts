export const isNull = (value: unknown) => value === null;

export const isUndefined = (value: unknown) => typeof value === 'undefined';

export const isString = (value: unknown) =>
  typeof value === 'string' || value instanceof String;

export const isNumber = (value: unknown) =>
  typeof value === 'number' || value instanceof Number;

export const isObject = (value: unknown) =>
  typeof value === 'object' && !Array.isArray(value);
