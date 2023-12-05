import { diff } from './data';

describe('diff function', () => {
  it('should correctly identify differences in simple objects', () => {
    const updatedData = { a: 1, b: 'foo', c: { nested: 'bar' } };
    const originalData = { a: 1, b: 'bar', c: { nested: 'bar' } };

    const result = diff(updatedData, originalData);

    // Expect differences in 'b' and 'c'.
    expect(result).toEqual({ b: 'foo' });
  });

  it('should handle bidirectional diff correctly', () => {
    const updatedData = { a: 1, b: 'foo', c: { nested: 'bar' } };
    const originalData = { a: 1, b: 'bar', c: { nested: 'baz' } };

    const result = diff(updatedData, originalData);

    // Expect differences in 'b' and 'c' in both directions.
    expect(result).toEqual({ b: 'foo', c: { nested: 'bar' } });
  });

  it('should handle nested objects', () => {
    const updatedData = { a: 1, b: { nested: { x: 42, y: 'foo' } } };
    const originalData = { a: 1, b: { nested: { x: 42, y: 'bar' } } };

    const result = diff(updatedData, originalData);

    // Expect differences in 'b.nested.y'.
    expect(result).toEqual({ b: { nested: { y: 'foo' } } });
  });

  it('should handle empty objects', () => {
    const updatedData = {};
    const originalData = {};

    const result = diff(updatedData, originalData);

    // Expect an empty object as there are no differences.
    expect(result).toEqual({});
  });

  it('should handle bidirectional diff with no differences', () => {
    const updatedData = { a: 1, b: 'foo' };
    const originalData = { a: 1, b: 'foo' };

    const result = diff(updatedData, originalData);

    // Expect an empty object as there are no differences.
    expect(result).toEqual({});
  });

  it('should set missing keys in updatedData to null', () => {
    const updatedData = { a: 1, b: 'foo', c: { nested: 'bar' } };
    const originalData = { a: 1, b: 'bar', c: { nested: 'bar' }, d: 'extra' };

    const result = diff(updatedData, originalData);

    // Expect differences in 'b', 'c', and 'd'.
    expect(result).toEqual({ b: 'foo', d: null });
  });

  it('should handle missing nested keys by setting them to null', () => {
    const updatedData = {
      a: 1,
      b: {
        nested: {
          x: 42,
          y: 'foo',
        },
      },
    };
    const originalData = {
      a: 1,
      b: {
        nested: {
          x: 42,
          y: 'bar',
          z: 'extra',
        },
      },
    };

    const result = diff(updatedData, originalData);

    // Expect differences in 'b.nested.y' and 'b.nested.z'.
    expect(result).toEqual({ b: { nested: { y: 'foo', z: null } } });
  });

  it('should not add nulls for keys that exist in both objects', () => {
    const updatedData = { a: 1, b: 'foo' };
    const originalData = { a: 1, b: 'bar' };

    const result = diff(updatedData, originalData);

    // Expect differences in 'b' only.
    expect(result).toEqual({ b: 'foo' });
  });

  it('should set missing keys in updatedData to null when originalData is empty', () => {
    const updatedData = { a: 1, b: 'foo', c: { nested: 'bar' } };
    const originalData = {};

    const result = diff(updatedData, originalData);

    // Expect differences in 'a', 'b', and 'c'.
    expect(result).toEqual({ a: 1, b: 'foo', c: { nested: 'bar' } });
  });
});
