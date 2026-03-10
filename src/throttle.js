const throttle = (fn, relay) => {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastTime >= relay) {
      fn.call(this, ...args);
      lastTime = now;
    }
  };
};

const throttledFn = throttle(console.log, 1000);

// 连续调用
throttledFn("第一次"); // 立即执行
throttledFn("第二次"); // 被节流，不会执行
throttledFn("第三次"); // 被节流，不会执行

// 等待1秒后再次调用
setTimeout(() => {
  throttledFn("第四次"); // 会执行
}, 1000);

export { throttle };
