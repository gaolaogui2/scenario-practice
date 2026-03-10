import './../src/bind.js'; // 导入以添加 Function.prototype.myBind

describe('Function.prototype.myBind', () => {
  test('should bind context and preset arguments', () => {
    const obj = { name: 'Alice' };
    function greet(greeting, punctuation) {
      return `${greeting}, ${this.name}${punctuation}`;
    }
    const boundGreet = greet.myBind(obj, 'Hello');
    expect(boundGreet('!')).toBe('Hello, Alice!');
  });

  test('should work with new operator', () => {
    function Person(name) {
      this.name = name;
    }
    const BoundPerson = Person.myBind({}, 'Bob');
    const instance = new BoundPerson();
    expect(instance.name).toBe('Bob');
  });

  test('should preserve this if context is null or undefined', () => {
    function returnThis() {
      return this;
    }
    const boundFn = returnThis.myBind(null);
    expect(boundFn()).toBeUndefined();
  });

  test('should accept additional arguments when called', () => {
    const obj = { x: 0 };
    function sum(a, b, c) {
      return this.x + a + b + c;
    }
    const boundSum = sum.myBind(obj, 1);
    expect(boundSum(2, 3)).toBe(6);
  });
});