# Vue 3数据劫持

vue 3主要通过ES6新特性proxy来实现数据劫持

## 先看源码

```javascript
// packages/reactivity/src/reactive.ts
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  // 参数里面，这个就是关键，代理的函数都在里面
  // 针对不同情况可以传不同的处理函数，无非就是针对是否只读，是否浅
  // 但我们只要原理，只要正常的代理就行
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  // 其它代码都省略掉，直入主题
  ...
  // 这就是代理的使用格式，target就是要代理的对象，可以是数组，第二个参数就是要给出代理什么方法
  // TargetType.COLLECTION是判断它是否是集合类型的对象
  // 比如map，set等，如果是，就要多做一些处理，用另外的方法做代理，但最后肯定也是用Proxy，这里忽略
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  ...
  return proxy
}
// 这就是给目标加数据劫持的方法，也就是代理
// 这样的函数有好几个，就是针对不同的对象类型，给不同的处理方法去处理
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    // 这个就是处理函数，主要看这个
    mutableHandlers,
    mutableCollectionHandlers
  )
}
```

```javascript

// packages/reactivity/src/baseHandlers.ts
export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
}
// 那这些get，set...，是哪里来的？其实就是由别的函数生成出来的
// 一个一个来

// 先看get，就是看createGetter
const get = /*#__PURE__*/ createGetter()
function createGetter(isReadonly = false, shallow = false) {
  // 要生成的get方法
  return function get(target: Target, key: string | symbol, receiver: object) {
    ...
    ...
    // 判断目标是否数组
    const targetIsArray = isArray(target)
    // 这里判断如果是数组的一些获取信息的数组方法，就调用另外准备好的对应方法就行
    // ['includes', 'indexOf', 'lastIndexOf']，这里判断是否这些方法
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }
    // 正常获取值，
    // Reflect.get相当于target[key],
    // Reflect还包含了对象很多一般操作方法
    const res = Reflect.get(target, key, receiver)

    ...
    // 如果要返回的值是对象，递归代理它
    // 里面会判断是否null，typeof是否是'object'
    // 所以数组也会判断为对象
    // 这里是取值的时候做代理，这就不会像vue2那样一开始就深度递归所有对象和数组去做代理
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

// 看set
const set = /*#__PURE__*/ createSetter()
function createSetter(shallow = false) {
  // 生成的set方法
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    // 取旧值
    const oldValue = (target as any)[key]
    ...
    ...
    // 判断这个key是否在target里面
    // 如果是数组，并且key是整数值，就看这个key是否在数组长度范围内
    // 否则就常规判断这个key是否target的属性
    // hasOwn用的是Object.hasOwnProperty.call
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)
    // 这里相当于target[key] = value，就是设值
    const result = Reflect.set(target, key, value, receiver)
    // don't trigger if target is something up in the prototype chain of original
    if (target === toRaw(receiver)) {
      // 触发响应，就是数据变了，要进行响应
      // 这里对于新的value不需要加代理/劫持，因为都是get的时候加
      if (!hadKey) {
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return result
  }
}
// 删除属性
function deleteProperty(target: object, key: string | symbol): boolean {
  // 有这个属性
  const hadKey = hasOwn(target, key)
  const oldValue = (target as any)[key]
  // 删除属性
  const result = Reflect.deleteProperty(target, key)
  // 能删除并且确实有这个属性，触发响应式
  if (result && hadKey) {
    trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
  }
  return result
}
// 查询是否有这个属性，这个其实不用管，
function has(target: object, key: string | symbol): boolean {
  const result = Reflect.has(target, key)
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, TrackOpTypes.HAS, key)
  }
  return result
}
// 获取对象所有key，其实也不用管
function ownKeys(target: object): (string | number | symbol)[] {
  track(target, TrackOpTypes.ITERATE, isArray(target) ? 'length' : ITERATE_KEY)
  return Reflect.ownKeys(target)
}
```

## 简短复写核心意思

根据vue 3的实现，这里写个简短的实现

```javascript
function reactive(target) {
  // 用typeof的话，数组也是返回'object'
  if (!target || typeof target !== 'object') {
    return target;
  }
  return new Proxy(target, {
    get(target, key, receiver) {
      // get的时候做劫持，返回被劫持的内容
      return reactive(Reflect.get(target, key, receiver));
    },
    set(target, key, value, receiver) {
      // 赋相同值，直接返回成功
      if (target[key] === value) {
        return true;
      }
      const result = Reflect.set(target, key, value, receiver);
      // 本来就有的key
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        console.log('改变原有属性');
      } else {
        console.log('新加的属性');
      }
      // 通知数据变化，做响应式处理
      notice();
      return result;
    },
    deleteProperty(target, key) {
      // 有这个属性
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      // 删除属性
      const result = Reflect.deleteProperty(target, key)
      // 能删除并且确实有这个属性，触发响应式
      if (result && hadKey) {
        notice();
      }
      return result
    }
  });
}
```
