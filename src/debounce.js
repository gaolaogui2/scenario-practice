const debounce = (fn, delay) => {
  let timer = null;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.call(this, ...args);
      timer = null;
    }, delay);
  };
};

const debouncedFn = debounce(console.log, 500);
debouncedFn("hello"); // 不会立即执行
debouncedFn("world"); // 上一次被取消，只会输出 world

export { debounce };
