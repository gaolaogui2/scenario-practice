/**
 * 实现 1 个带并发限制的异步调度器 Schedular ，保证同时运行的任务至多 n 个。
 * .add 要返回 Promise
 */

class Scheduler {
  concurrencyLimit = 0;
  runningCount = 0;
  taskQueue = [];
  constructor(concurrencyLimit) {
    this.concurrencyLimit = concurrencyLimit;
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({
        task,
        resolve,
        reject,
      });
      this.processNext();
    });
  }

  async processNext() {
    if (
      this.runningCount >= this.concurrencyLimit ||
      this.taskQueue.length === 0
    ) {
      return;
    }
    this.runningCount++;
    const { task, resolve, reject } = this.taskQueue.shift();
    try {
      const res = await task();
      resolve(res);
    } catch (e) {
      reject(e);
    } finally {
      this.runningCount--;
      this.processNext();
    }
  }
}

const createTask = (id, duration) => {
  return () =>
    new Promise((resolve) => {
      console.log(`任务${id} 开始`);
      setTimeout(() => {
        console.log(`任务${id} 完成`);
        resolve(`任务${id} 结果`);
      }, duration);
    });
};

const scheduler = new Scheduler(2);

scheduler.add(createTask(1, 1000));
scheduler.add(createTask(2, 1000));
scheduler.add(createTask(3, 1000));
scheduler.add(createTask(4, 1000));

export { Scheduler };
