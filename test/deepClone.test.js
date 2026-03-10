import { deepClone } from './../src/deepClone.js';

describe('deepClone', () => {
  test('should clone primitive values', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('string')).toBe('string');
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  test('should clone plain object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
  });

  test('should clone array', () => {
    const arr = [1, 2, { x: 3 }];
    const cloned = deepClone(arr);
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[2]).not.toBe(arr[2]);
  });

  test('should handle circular references', () => {
    const obj = { a: 1 };
    obj.self = obj;
    const cloned = deepClone(obj);
    expect(cloned.a).toBe(1);
    expect(cloned.self).toBe(cloned);
    expect(cloned.self).not.toBe(obj);
  });

  test('should clone nested structures', () => {
    const original = {
      arr: [{ id: 1 }, { id: 2 }],
      obj: { nested: { value: 'deep' } },
    };
    const cloned = deepClone(original);
    expect(cloned.arr[0].id).toBe(1);
    expect(cloned.arr[0]).not.toBe(original.arr[0]);
    expect(cloned.obj.nested.value).toBe('deep');
    expect(cloned.obj.nested).not.toBe(original.obj.nested);
  });

  test('should ignore non-enumerable properties', () => {
    const obj = { a: 1 };
    Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false });
    const cloned = deepClone(obj);
    expect(cloned.a).toBe(1);
    expect(cloned.hidden).toBeUndefined();
  });
});