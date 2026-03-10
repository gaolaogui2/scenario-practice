import { GPromise } from './../src/promise.js';

describe('GPromise', () => {
  test('should resolve with value', async () => {
    const promise = new GPromise((resolve) => resolve(42));
    await expect(promise).resolves.toBe(42);
  });

  test('should reject with reason', async () => {
    const promise = new GPromise((_, reject) => reject('error'));
    await expect(promise).rejects.toBe('error');
  });

  test('then should chain resolved value', async () => {
    const result = await new GPromise((resolve) => resolve(1))
      .then((val) => val + 1)
      .then((val) => val * 2);
    expect(result).toBe(4);
  });

  test('catch should handle rejection', async () => {
    const result = await new GPromise((_, reject) => reject('fail'))
      .catch((err) => err + ' handled');
    expect(result).toBe('fail handled');
  });

  test('finally should execute', async () => {
    let finallyCalled = false;
    await new GPromise((resolve) => resolve(100))
      .finally(() => { finallyCalled = true; });
    expect(finallyCalled).toBe(true);
  });

  describe('static methods', () => {
    test('GPromise.resolve', async () => {
      const promise = GPromise.resolve(99);
      await expect(promise).resolves.toBe(99);
    });

    test('GPromise.reject', async () => {
      const promise = GPromise.reject('reject');
      await expect(promise).rejects.toBe('reject');
    });

    test('GPromise.all', async () => {
      const promises = [
        GPromise.resolve(1),
        GPromise.resolve(2),
        GPromise.resolve(3),
      ];
      const result = await GPromise.all(promises);
      expect(result).toEqual([1, 2, 3]);
    });

    test('GPromise.race', async () => {
      const fast = new GPromise((resolve) => setTimeout(() => resolve('fast'), 10));
      const slow = new GPromise((resolve) => setTimeout(() => resolve('slow'), 100));
      const result = await GPromise.race([fast, slow]);
      expect(result).toBe('fast');
    });
  });
});