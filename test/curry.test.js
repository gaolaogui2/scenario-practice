import { curry } from './../src/curry.js';

describe('curry', () => {
  test('should curry function with multiple arguments', () => {
    function add(a, b, c) {
      return a + b + c;
    }
    const curriedAdd = curry(add);
    expect(curriedAdd(1)(2)(3)).toBe(6);
    expect(curriedAdd(1, 2)(3)).toBe(6);
    expect(curriedAdd(1)(2, 3)).toBe(6);
    expect(curriedAdd(1, 2, 3)).toBe(6);
  });

  test('should preserve this context', () => {
    const obj = { x: 10 };
    function sum(a, b) {
      return this.x + a + b;
    }
    const curriedSum = curry(sum.bind(obj));
    expect(curriedSum(1)(2)).toBe(13);
  });

  test('should work with functions of zero arity', () => {
    const getFive = () => 5;
    const curried = curry(getFive);
    expect(curried()).toBe(5);
  });

  test('should allow extra arguments beyond arity?', () => {
    // Note: the curry implementation checks args.length >= len
    // If more arguments are provided than function length, it still calls fn.
    function add(a, b) {
      return a + b;
    }
    const curriedAdd = curry(add);
    expect(curriedAdd(1, 2, 3)).toBe(3); // third argument ignored
  });
});