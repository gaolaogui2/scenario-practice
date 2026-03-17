/**
 * 背景：
 * 你在开发一个前端构建系统（类似 Webpack/Vite 的简化版），系统需要按顺序处理各种构建任务：编译 TypeScript、处理 CSS、压缩图片、打包资源等。
 * 这些任务之间存在依赖关系：
 * 某些任务必须在其他任务完成后才能开始没有依赖关系的任务可以并行执行以提升效率如果存在循环依赖，需要报错
 *
 * 每个任务是一个异步函数，返回 Promise
 * type Task = () => Promise<void>
 *
 * 示例场景：
 * const scheduler = new TaskScheduler ()
 *
 * scheduler addTask('ts-compile', [], tsCompileTask)
 * scheduler.addTask('css-process', [], cssProcessTask)
 * scheduler.addTask('img-compress', [], imgCompressTask)
 * scheduler.addTask('js-bundle', ['ts-compile'], bundleTask)
 * scheduler.addTask('css-bundle', ['css-process'], cssBundleTask)
 * scheduler.addTask('asset-hash', ['js-bundle', 'css-bundle', 'img-compress'], hashTask)
 * scheduler.addTask('html-inject', ['asset-hash'], htmlTask)
 *
 * await scheduler.run()
 *
 * class TaskScheduler {
 *  // 注册任务
 *  // name： 任务名称
 *  // deps：依赖的任务名称列表
 *  // task： 异步任务函数
 *  addTask(name: string, deps: string[l, task: Task): void
 *
 *  // 执行所有任务，返回执行报告
 *  run (): Promise<void>
 * }
 */

class TaskScheduler {
  tasks;
  constructor() {
    this.tasks = new Map();
  }

  addTask(name, deps, task) {
    if (this.tasks.has(name)) {
      throw new Error("repeat xx");
    }
    this.tasks.set(name, { deps, task });
  }

  makeTopologicalOrder() {
    const names = [...this.tasks.keys()];

    const graphs = new Map(); // {name, [deDeps]}
    const remainingDeps = new Map(); // {name, count}

    for (const name of names) {
      const { deps = [] } = this.tasks.get(name);
      remainingDeps.set(name, deps.length);
      for (const dep of deps) {
        if (!graphs.has(dep)) {
          graphs.set(dep, []);
        }
        graphs.get(dep).push(name);
      }
    }

    const _graphs = new Map(graphs);
    const _remainingDeps = new Map(remainingDeps);

    const queue = [];
    for (const [name, count] of remainingDeps) {
      if (count === 0) {
        queue.push(name);
      }
    }

    const order = [];
    while (queue.length) {
      const name = queue.shift();
      order.push(name);
      for (const child of graphs.get(name) || []) {
        const newRemainingDeps = remainingDeps.get(child) - 1;
        remainingDeps.set(child, newRemainingDeps);
        if (newRemainingDeps == 0) {
          queue.push(child);
        }
      }
    }

    if (order.length < names.length) {
      throw new Error("circular xx");
    }

    return {
      order,
      graphs: _graphs,
      remainingDeps: _remainingDeps,
    };
  }

  async run() {
    const { order } = this.makeTopologicalOrder();

    const levels = []; // [[x,xx], [x]]
    const levelMap = new Map(); // {name, level}

    for (const name of order) {
      const { deps } = this.tasks.get(name);
      let maxDepsLevel = -1;

      for (const dep of deps) {
        if (!levelMap.has(dep)) {
          throw new Error("xx");
        }
        maxDepsLevel = Math.max(maxDepsLevel, levelMap.get(dep));
      }
      maxDepsLevel += 1;
      levelMap.set(name, maxDepsLevel);
      if (!levels[maxDepsLevel]) {
        levels[maxDepsLevel] = [];
      }
      levels[maxDepsLevel].push(name);
    }

    for (const tasks of levels) {
      await Promise.all(
        tasks.map((name) => {
          const { task } = this.tasks.get(name);
          return task();
        }),
      );
    }
  }

  async dynamicRun() {
    const { graphs, remainingDeps } = this.makeTopologicalOrder();

    const execute = async (name) => {
      const { task } = this.tasks.get(name);
      await task();
      const childrenTask = [];
      for (const dep of graphs.get(name) || []) {
        const newRemainingDeps = remainingDeps.get(dep) - 1;
        remainingDeps.set(dep, newRemainingDeps);
        if (newRemainingDeps === 0) {
          childrenTask.push(dep);
        }
      }
      await Promise.all(childrenTask.map((name) => execute(name)));
    };

    const initialTasks = [];

    for (const [name, count] of remainingDeps) {
      if (count === 0) {
        initialTasks.push(name);
      }
    }

    await Promise.all(initialTasks.map((name) => execute(name)));
  }
}

export { TaskScheduler };
