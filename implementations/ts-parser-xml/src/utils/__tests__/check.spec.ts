import { isNull, isUndefined, isNumber, isString } from '~/utils/check';

describe('check', () => {
  it('isNull', () => {
    expect(isNull(null)).toBe(true);

    expect(isNull('')).toBe(false);
    expect(isNull(1)).toBe(false);
    expect(isNull(undefined)).toBe(false);
    expect(isNull({})).toBe(false);
    expect(isNull(() => {})).toBe(false);
    expect(isNull(/hello/)).toBe(false);
  });

  it('isUndefined', () => {
    expect(isUndefined(undefined)).toBe(true);

    expect(isUndefined('')).toBe(false);
    expect(isUndefined(1)).toBe(false);
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined({})).toBe(false);
    expect(isUndefined(() => {})).toBe(false);
    expect(isUndefined(/hello/)).toBe(false);
  });

  it('isNumber', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(1)).toBe(true);
    expect(isNumber(1.0)).toBe(true);
    expect(isNumber(0.0)).toBe(true);
    expect(isNumber(0.1)).toBe(true);
    expect(isNumber(1.1)).toBe(true);
    expect(isNumber(-0)).toBe(true);
    expect(isNumber(-1)).toBe(true);
    expect(isNumber(-1.0)).toBe(true);
    expect(isNumber(-0.0)).toBe(true);

    expect(isNumber('-0.1')).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber(() => {})).toBe(false);
    expect(isNumber(/hello/)).toBe(false);
  });

  it('isString', () => {
    expect(isString('')).toBe(true);
    expect(isString('hello')).toBe(true);
    expect(isString('hello world')).toBe(true);

    expect(isString(0)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(() => {})).toBe(false);
    expect(isString(/hello/)).toBe(false);
  });
});
