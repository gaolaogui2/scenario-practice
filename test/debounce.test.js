import { jest, describe, test, expect } from '@jest/globals';
import { debounce } from './../src/debounce.js';

describe('debounce', () => {
  jest.useFakeTimers();

  test('should delay function execution', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced('hello');
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('hello');
  });

  test('should cancel previous pending call', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced('first');
    jest.advanceTimersByTime(50);
    debounced('second');
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });

  test('should preserve context', () => {
    const context = { value: 42 };
    const fn = jest.fn(function() { return this.value; });
    const debounced = debounce(fn.bind(context), 100);
    debounced();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('should allow multiple calls after delay', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced('first');
    jest.advanceTimersByTime(100);
    debounced('second');
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('first');
    expect(fn).toHaveBeenCalledWith('second');
  });
});