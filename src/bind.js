Function.prototype.myBind = function (context, ...args) {
  context = context || window;
  const fn = this;
  return (...nextArgs) => fn.call(context, ...args, ...nextArgs);
};

// 测试用例
const obj = {
  name: "Alice",
};

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const boundGreet = greet.myBind(obj, "Hello");
console.log(boundGreet("!")); // "Hello, Alice!"

export {};
