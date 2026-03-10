import { spawn } from './../src/async&await.js';

describe('spawn (async/await simulation)', () => {
  test('should work like async/await with promises', async () => {
    const result = await spawn(function* () {
      const a = yield Promise.resolve(1);
      const b = yield Promise.resolve(2);
      return a + b;
    });
    expect(result).toBe(3);
  });

  test('should propagate errors', async () => {
    const error = new Error('test error');
    await expect(spawn(function* () {
      yield Promise.reject(error);
    })).rejects.toThrow('test error');
  });

  test('should handle synchronous values', async () => {
    const result = await spawn(function* () {
      const x = yield 42;
      return x * 2;
    });
    expect(result).toBe(84);
  });

  test('should preserve generator return value', async () => {
    const result = await spawn(function* () {
      yield 'something';
      return 'done';
    });
    expect(result).toBe('done');
  });
});