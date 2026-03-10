function deepClone(target, hash = new WeakMap()) {
  if (typeof target !== "object" || target === null) {
    return target;
  }

  const res = Array.isArray(target) ? [] : {};

  hash.set(target, res);
  function clone(originObj, newObj) {
    for (let key in originObj) {
      if (!Object.prototype.hasOwnProperty.call(originObj, key)) {
        continue;
      }
      const currentVal = originObj[key];
      if (typeof currentVal !== "object" || currentVal === null) {
        newObj[key] = currentVal;
      } else {
        if (hash.has(currentVal)) {
          newObj[key] = hash.get(currentVal);
          continue;
        }
        if (Array.isArray(currentVal)) {
          newObj[key] = [];
        } else {
          newObj[key] = {};
        }
        hash.set(currentVal, newObj[key]); // 提前保存
        clone(currentVal, newObj[key]);
      }
    }
  }
  clone(target, res);
  return res;
}

export { deepClone };
