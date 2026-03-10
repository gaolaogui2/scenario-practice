Function.prototype.myCall = function (context, ...args) {
  context = context || window;
  const fnKey = Symbol();
  context[fnKey] = this;
  const res = context[fnKey](...args);
  delete context[fnKey];
  return res;
};

Function.prototype.myApply = function (context, args) {
  context = context || window;
  const fnKey = Symbol();
  context[fnKey] = this;
  const res = args ? context[fnKey](...args) : context[fnKey](); // 这里 apply 只有 2 个参数，so 后面的 args 可能为 undefined
  delete context[fnKey];
  return res;
};

export {};
