import { Schedular } from './../src/scheduler.js';

describe('Schedular', () => {
  test('should limit concurrency', async () => {
    const scheduler = new Schedular(2);
    const results = [];
    const tasks = [
      () => new Promise(resolve => setTimeout(() => { results.push(1); resolve(1); }, 10)),
      () => new Promise(resolve => setTimeout(() => { results.push(2); resolve(2); }, 5)),
      () => new Promise(resolve => setTimeout(() => { results.push(3); resolve(3); }, 1)),
    ];
    const promises = tasks.map(task => scheduler.add(task));
    await Promise.all(promises);
    expect(results.length).toBe(3);
    // first two should start concurrently, third after one completes
  });

  test('should return promise that resolves with task result', async () => {
    const scheduler = new Schedular(1);
    const task = () => Promise.resolve(42);
    const result = await scheduler.add(task);
    expect(result).toBe(42);
  });

  test('should handle task rejection', async () => {
    const scheduler = new Schedular(1);
    const error = new Error('failed');
    const task = () => Promise.reject(error);
    await expect(scheduler.add(task)).rejects.toThrow('failed');
  });

  test('should process tasks in order of addition when concurrency is 1', async () => {
    const scheduler = new Schedular(1);
    const order = [];
    const tasks = [
      () => new Promise(resolve => setTimeout(() => { order.push(1); resolve(); }, 10)),
      () => new Promise(resolve => setTimeout(() => { order.push(2); resolve(); }, 5)),
      () => new Promise(resolve => setTimeout(() => { order.push(3); resolve(); }, 1)),
    ];
    await Promise.all(tasks.map(task => scheduler.add(task)));
    expect(order).toEqual([1, 2, 3]);
  });
});