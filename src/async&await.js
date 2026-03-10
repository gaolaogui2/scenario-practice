/**
 * async await 本质上是 Generator + Promise 的语法糖，
 * 目的是将异步代码转为同步执行的形式。
 */

// async function foo() {
//   await bar();
//   return 123;
// }

// 被转换为类似（简化）：
// function foo() {
//   return new Promise((resolve, reject) => {
//     const generator = (function* () {
//       yield bar();
//       return 123;
//     })();

//     function step(nextFn) {
//       let next;
//       try {
//         next = nextFn();
//       } catch (e) {
//         return reject(e);
//       }

//       if (next.done) {
//         return resolve(next.value);
//       }

//       Promise.resolve(next.value).then(
//         (val) => step(() => generator.next(val)),
//         (err) => step(() => generator.throw(err))
//       );
//     }

//     step(() => generator.next());
//   });
// }

const mockAsync = spawn(function* () {
  console.log("开始");
  const result = yield new Promise((res) =>
    setTimeout(() => res("数据"), 1000)
  ); // 模拟 await
  console.log("收到:", result);
  return "完成";
});

mockAsync.then(console.log); // 最终输出：'完成'

function spawn(genFn) {
  return new Promise((resolve, reject) => {
    const gen = genFn();

    function step(nextFn) {
      let next;
      try {
        next = nextFn();
      } catch (e) {
        reject(e);
      }
      if (next.done) {
        resolve(next.value);
        return;
      }
      Promise.resolve(next.value).then(
        (v) => step(() => gen.next(v)),
        (e) => step(() => gen.throw(e))
      );
    }

    step(() => gen.next());
  });
}

export { spawn };
