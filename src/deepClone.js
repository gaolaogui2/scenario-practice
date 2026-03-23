function deepClone(target) {
  if (typeof target !== "object" || target === null) {
    return target;
  }

  const hash = new WeakMap();
  const res = Array.isArray(target) ? [] : {};

  function clone(origin, result) {
    for (const key in origin) {
      if (!Object.prototype.hasOwnProperty(key)) {
        continue;
      }
      const currentVal = origin[key];
      if (typeof currentVal !== "object" || currentVal === null) {
        result[key] = currentVal;
        continue;
      }
      if (hash.has(currentVal)) {
        result[key] = hash.get(currentVal);
        continue;
      }
      result[key] = Array.isArray(currentVal) ? [] : {};
      hash.set(currentVal, result[key]);
      clone(currentVal, result[key]);
    }
  }

  hash.set(target, res);
  clone(target, res);
  return res;
}

export { deepClone };
