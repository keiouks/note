# Promise三种状态

Promise是一个类，说它的三种状态是指它的实例的三种状态，分别是`pending`，`fulfilled`，`rejected`。

```javascript
var p = new Promise((resolve, reject)=>{
  if (...) {
    resolve(...);
  } else {
    reject(...);
  }
});
```

创建一个Promise实例p，这个时候p就是`pending`状态。只有p被执行的时候，才会变成另外的状态。所谓执行，就是通过`then`方法或者是`async`函数里的`await`语句触发执行。状态变化是不可逆的。

```javascript
// 触发执行后，如果p内部最后调用了resolve方法，那p就变成fulfilled状态，如果调用了reject方法，就变成rejected状态。
// then
p.then(()=>{
  // 变成fulfilled状态
}, ()=>{
  // 变成rejected状态
});

// await
async function () {
  ...
  var x = await p;
  ...
  return x;
}
```
