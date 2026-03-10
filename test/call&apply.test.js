import './../src/call&apply.js'; // 导入以添加 Function.prototype.myCall/myApply

describe('Function.prototype.myCall', () => {
  test('should call function with context and arguments', () => {
    const obj = { value: 42 };
    function getValue(plus) {
      return this.value + plus;
    }
    const result = getValue.myCall(obj, 8);
    expect(result).toBe(50);
  });

  test('should work with null context', () => {
    function returnThis() {
      return this;
    }
    const result = returnThis.myCall(null);
    expect(result).toBeUndefined();
  });

  test('should handle no arguments', () => {
    const obj = { value: 100 };
    function getValue() {
      return this.value;
    }
    const result = getValue.myCall(obj);
    expect(result).toBe(100);
  });
});

describe('Function.prototype.myApply', () => {
  test('should apply function with context and arguments array', () => {
    const obj = { value: 10 };
    function sum(a, b, c) {
      return this.value + a + b + c;
    }
    const result = sum.myApply(obj, [1, 2, 3]);
    expect(result).toBe(16);
  });

  test('should work with empty arguments array', () => {
    const obj = { value: 7 };
    function getValue() {
      return this.value;
    }
    const result = getValue.myApply(obj, []);
    expect(result).toBe(7);
  });

  test('should work with null arguments', () => {
    const obj = { value: 5 };
    function getValue() {
      return this.value;
    }
    const result = getValue.myApply(obj);
    expect(result).toBe(5);
  });
});