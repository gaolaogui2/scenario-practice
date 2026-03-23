const curry = (fn) => {
  const { length } = fn;

  return function curried(...args) {
    if (args.length >= length) {
      return fn.call(this, ...args);
    }
    return function (...nextArgs) {
      return curried.call(this, ...args, ...nextArgs);
    };
  };
};

// 定义一个普通函数
function add(a, b, c) {
  return a + b + c;
}

// 柯里化后的函数
const curriedAdd = curry(add);

// 以下几种调用方式结果相同
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6

export { curry };
