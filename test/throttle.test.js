import { jest, describe, test, expect } from '@jest/globals';
import { throttle } from './../src/throttle.js';

describe('throttle', () => {
  jest.useFakeTimers();

  test('should call function immediately on first call', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 1000);
    throttled('first');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('first');
  });

  test('should throttle subsequent calls within delay', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 1000);
    throttled('first');
    throttled('second');
    throttled('third');
    expect(fn).toHaveBeenCalledTimes(1); // only first call
    expect(fn).toHaveBeenCalledWith('first');
  });

  test('should allow call after delay', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 1000);
    throttled('first');
    jest.advanceTimersByTime(1000);
    throttled('second');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('first');
    expect(fn).toHaveBeenCalledWith('second');
  });

  test('should preserve context', () => {
    const context = { value: 42 };
    const fn = jest.fn(function() { return this.value; });
    const throttled = throttle(fn.bind(context), 1000);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});