class GPromise {
  state = "pending";
  value;
  reason;
  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  resolve = (value) => {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    this.value = value;
    this.onFulfilledCallbacks.forEach((callback) => callback());
  };

  reject = (reason) => {
    if (this.state !== "pending") return;
    this.state = "rejected";
    this.reason = reason;
    this.onRejectedCallbacks.forEach((callback) => callback()); // TODO 逻辑错误
  };

  then = (onFulfilled, onRejected) => {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    return new GPromise((resolve, reject) => {
      if (this.state === "pending") {
        this.onFulfilledCallbacks.push(() => {
          try {
            const result = onFulfilled(this.value);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            const result = onRejected(this.reason);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.state === "fulfilled") {
        try {
          const result = onFulfilled(this.value);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      } else if (this.state === "rejected") {
        try {
          const result = onRejected(this.reason);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      }
    });
  };

  catch = (onRejected) => {
    return this.then(null, onRejected);
  };

  finally = (callback) => {
    return this.then(
      (value) => GPromise.resolve(callback).then(() => value),
      (reason) =>
        GPromise.resolve(callback).then(() => {
          throw reason;
        }),
    );
  };

  static resolve(value) {
    if (value instanceof GPromise) {
      return value;
    }
    return new GPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new GPromise((_resolve, reject) => reject(reason));
  }

  static all(promises) {
    return new GPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        reject(new TypeError("promises must be an Array"));
        return;
      }
      let count = promises.length;
      if (count === 0) {
        resolve([]);
      }
      const values = new Array(count);
      let resolvedCount = 0;
      promises.forEach((promise, index) => {
        GPromise.resolve(promise).then(
          (value) => {
            values[index] = value;
            resolvedCount++;
            if (resolvedCount === count) {
              resolve(values);
            }
          },
          (reason) => reject(reason),
        );
      });
    });
  }

  static race(promises) {
    return new GPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        reject(new TypeError("promises must be an Array"));
        return;
      }
      promises.forEach((promise) => {
        GPromise.resolve(promise).then(
          (value) => resolve(value),
          (reason) => reject(reason),
        );
      });
    });
  }
}

export { GPromise };

class _Promise {
  status = "pendding";
  value;
  reason;
  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  resolve(value) {
    if (this.status === "pendding") {
      this.value = value;
      this.status = "fulfilled";
      this.onFulfilledCallbacks((cb) => cb());
    }
  }

  reject(reason) {
    if (this.status === "pendding") {
      this.reason = reason;
      this.status = "rejected";
      this.onRejectedCallbacks((cb) => cb());
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onFulfilled =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    return new _Promise((resolve, reject) => {
      if (this.status === "pendding") {
        this.onFulfilledCallbacks.push(() => {
          try {
            const result = onFulfilled(this.value);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            const result = onRejected(this.reason);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.status === "fulfilled") {
        try {
          const result = onFulfilled(this.value);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      } else {
        try {
          const result = onRejected(this.reason);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      (value) => new _Promise.resolve(callback).then(() => value),
      (reason) =>
        new _Promise.resolve(callback).then(() => {
          throw reason;
        }),
    );
  }

  static resolve(value) {
    if (value instanceof _Promise) {
      return value;
    }
    return new _Promise((resolve) => resolve(value));
  }

  static reject(reason) {
    if (reason instanceof _Promise) {
      return reason;
    }
    return new _Promise((_, reject) => reject(reason));
  }

  static all(promises) {
    return new _Promise((resolve, reject) => {
      if (Array.isArray(promises)) {
        reject(new TypeError("promises must be Array"));
        return;
      }
      let count = promises.length;
      if (count === 0) {
        resolve([]);
      }

      const values = new Array(count);
      let resolvedCount = 0;
      promises.forEach((promise, index) => {
        _Promise.resolve(promise).then(
          (value) => {
            values[index] = value;
            resolvedCount++;
            if (resolvedCount === count) {
              resolve(values);
            }
          },
          (reason) => reject(reason),
        );
      });
    });
  }
}
