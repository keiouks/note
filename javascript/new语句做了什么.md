# new 语句做了什么

写一个new函数来说明它做了什么

```javascript
function new2 (func) {
  // 把prototype给新对象
  var o = Object.create(func.prototype);
  // 让o经历func对this的处理
  var k = func.call(o);
  // 构造函数如果返回的是另一个对象，或者返回一个函数，那new的结果就是返回的这个k，
  // 否则就是构造出来的这个o
  if (k && ((typeof k === 'object') || (typeof k === 'function'))) {
    return k;
  } else {
    return o;
  }
}
```