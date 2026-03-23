Function.prototype.call = function (context, ...args) {
  context = context || window;
  const fnKey = Symbol();
  context[fnKey] = this;
  const res = context[fnKey](...args);
  delete context[fnKey];
  return res;
};

Function.prototype.apply = function (context, args) {
  context = context || window;
  const fnKey = Symbol();
  context[fnKey] = this;
  const res = context[fnKey](...(args || []));
  delete context[fnKey];
  return res;
};

export {};
