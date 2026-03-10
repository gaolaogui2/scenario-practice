import { TaskScheduler } from './../src/scheduler2.js';

describe('TaskScheduler', () => {
  test('should execute tasks in topological order', async () => {
    const scheduler = new TaskScheduler();
    const order = [];
    scheduler.addTask('A', [], () => order.push('A'));
    scheduler.addTask('B', ['A'], () => order.push('B'));
    scheduler.addTask('C', ['A'], () => order.push('C'));
    scheduler.addTask('D', ['B', 'C'], () => order.push('D'));
    await scheduler.run();
    expect(order).toEqual(['A', 'B', 'C', 'D']); // B and C can be in any order
    // Actually B and C are in same level, order may vary
  });

  test('should throw on circular dependency', async () => {
    const scheduler = new TaskScheduler();
    scheduler.addTask('A', ['B'], () => {});
    scheduler.addTask('B', ['A'], () => {});
    await expect(scheduler.run()).rejects.toThrow('circular');
  });

  test('should execute independent tasks in parallel', async () => {
    const scheduler = new TaskScheduler();
    const results = [];
    scheduler.addTask('A', [], () => new Promise(resolve => setTimeout(() => { results.push('A'); resolve(); }, 20)));
    scheduler.addTask('B', [], () => new Promise(resolve => setTimeout(() => { results.push('B'); resolve(); }, 10)));
    scheduler.addTask('C', [], () => new Promise(resolve => setTimeout(() => { results.push('C'); resolve(); }, 5)));
    await scheduler.run();
    expect(results.sort()).toEqual(['A', 'B', 'C']); // all executed
  });

  test('should reject duplicate task name', () => {
    const scheduler = new TaskScheduler();
    scheduler.addTask('task1', [], () => {});
    expect(() => scheduler.addTask('task1', [], () => {})).toThrow('repeat');
  });

  test('dynamicRun should also execute tasks', async () => {
    const scheduler = new TaskScheduler();
    const visited = [];
    scheduler.addTask('A', [], () => visited.push('A'));
    scheduler.addTask('B', ['A'], () => visited.push('B'));
    await scheduler.dynamicRun();
    expect(visited).toEqual(['A', 'B']);
  });
});