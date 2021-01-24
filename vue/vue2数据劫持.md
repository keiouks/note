# Vue 2数据劫持

先直接上源码，注释就是解读

```javascript
// src/core/instance/state.js
// vue在初始化构建的时候，会拿data去做初始化，而数据劫持就是从这里开始
// 当然，还有组件属性的劫持，还有方法的监听，但这里从data的劫持就能知道vue 2究竟是怎么劫持数据做响应式的
function initData (vm: Component) {
  // $options就是使用new vue时传进来的整个配置，包括data，method，created，components等属性
  // initData之前的行为创建了$options
  let data = vm.$options.data
  // 给vm加个_data属性，下面有用
  data = vm._data = typeof data === 'function'
    ? getData(data, vm) // 如果data是函数，就调用这个函数拿到返回的数据
    : data || {} // data不是函数就直接获取data
  if (!isPlainObject(data)) { // 如果data不是普通的对象，给他赋值空对象
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // 拿到data上的key
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    // 轮询每个key 
    const key = keys[i]
    // 先判断有没有跟方法名或属性名同名冲突
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      // 判断是否$ 或 _开头，如果不是
      // 给vm直接添加key属性，通过Object.defineProperty，
      // 而get和set都是通过vm._data[key]这个中间量来存取
      // 所以可以通过vm[key]直接访问到一开始在data设置的属性
      proxy(vm, `_data`, key)
    }
  }
  // 重点，对data做数据劫持
  observe(data, true /* asRootData */)
}
```

```javascript
// src/core/observer/index.js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  // 如果不是对象，或者是一个虚拟节点，就不能做劫持
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 如果已经存了一个__ob__并且是Observer类型对象，直接用这个就行
  // 但对于一开始要劫持的data，显然没有__ob__，
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve && // 需要劫持
    !isServerRendering() && // 非服务端渲染
    (Array.isArray(value) || isPlainObject(value)) && // 是数组，或，是普通对象
    Object.isExtensible(value) && // 是可扩展，这里就是读对象的配置属性
    !value._isVue // 没有'_isVue'这个属性
  ) {
    // 具体劫持工作在这个类构造里面
    ob = new Observer(value)
  }
  // 如果是根数据，并且拿到被劫持的对象
  // 记录有几个vm用这个对象做根data
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

export class Observer {
  value: any;
  dep: Dep;
  vmCount: number;

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    // 给对象加属性
    def(value, '__ob__', this)
    // 如果是数组
    if (Array.isArray(value)) {
      // 判断能不能用__proto__属性，const hasProto = '__proto__' in {}
      // 下面的 arrayMethods是关键，是对Array.prototype里面方法改造后凑成的新的数组方法集合
      // 目的是用改造后的数组方法替换原有的数组方法，为了让那些数组方法的调用也能受到劫持影响。
      if (hasProto) {
        // 把arrayMethods作为劫持数组的__proto__  
        protoAugment(value, arrayMethods)
      } else {
        // 把arrayMethods里面的每个属性/方法逐个定义到被劫持的数组里面
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 对数组里面的元素递归调用observe，逐个劫持
      this.observeArray(value)
    } else {
      // 所有未被劫持的对象最后都会走到这里，
      // 从data这个根开始递归走到这里
      // 数组的元素是对象的话也会走到这里
      this.walk(value)
    }
  }
  // 劫持对象
  walk (obj: Object) {
    // 逐个属性劫持
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
  
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()
  // 看看要劫持的属性是否可配置
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // 拿到原来的配置里面的setter和getter，如果原来的属性就已经被劫持过就会有，目的是根据原来的情况判断是否只读，同时要用原有getter和setter保持一致
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  // 如果这个属性是对象，当然要递归劫持
  let childOb = !shallow && observe(val)
  // 对象重新定义这个属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // 如果本身就有getter方法，用这个方法获取值，否则直接取val值
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          // 如果值是数组，递归
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      // 如果要设置的值跟原来的相同，什么都不做，后面变量自己不等于自己这种写法，为true的话就是NaN，两个都是NaN，就认为是相等
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // 写了getter不写setter说明原来是定义只读属性
      if (getter && !setter) return
      // 如果有setter就用setter来赋值，否则就直接赋值
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 新的值要做劫持
      childOb = !shallow && observe(newVal)
      // 通知响应式系统数据改变了
      dep.notify()
    }
  })
}
```

```javascript
// src/core/observer/array.js
import { def } from '../util/index'

// 拿到Array原生方法集合
const arrayProto = Array.prototype
// 创造新对象，把arrayProto作为arrayMethods的prototype
export const arrayMethods = Object.create(arrayProto)

// 要重写的方法列表
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

 // 逐个方法重写，重写数组的方法，用这些方法替换原来的方法，因为原来的方法不受劫持的监听
methodsToPatch.forEach(function (method) {
  // 拿到方法
  const original = arrayProto[method]
  // 给arrayMethods定义一个同名方法
  def(arrayMethods, method, function mutator (...args) {
    // 方法运行结果，this将会是被劫持的对象，因为arrayMethods会成为被劫持对象的__proto__或者其里面的方法会成为被劫持对象的属性
    const result = original.apply(this, args)
    const ob = this.__ob__
    // 某些方法会给数组新增元素，新增的元素也要被劫持
    // 这里就是知道哪些方法会新增元素，并获取被新增的元素数组
    let inserted 
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 新加的元素加劫持
    if (inserted) ob.observeArray(inserted)
    // 通知有劫持数据变化
    ob.dep.notify()
    return result
  })
})
```

------

## 简短提取关键做法

抽出vue 2劫持对象的关键代码，做个简短实现

```javascript
// 针对数组的准备
const oldProto = Array.prototype;
// 新的proto要覆盖某些数组方法
// 先收集这些方法
const newProto = Object.create(oldProto);
// 要覆盖的方法
['push','pop','unshift','shift','sort','splice','reverse'].forEach((method) => {
  // 新proto写同名方法
  newProto[method] = function(..args) {
    // 还是调用已有·原有方法的实现
    const result = oldProto[method].apply(this, args);
    let inserted;
    // 会新增元素的方法，拿到新增的元素数组
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    // 劫持新增元素
    if (inserted) {
      args.forEach(arg => {
        observe(arg);
      });
    }
    notice();
    return result;
  }
});

function observe(data) {
  // 不是数组，不是对象
  if (!Array.isArray(data) && !(Object.prototype.toString.call(data) === '[object Object]')) {
    return data;
  }
  // 是数组，覆盖个别原生方法
  if (Array.isArray(data)) {
    data.__proto__ = newProto;
  }
  // 遍历所有属性
  Object.keys(data).forEach(key => {
    const value = data[key];
    // 每个属性值进行递归劫持，
    // 如果这个属性值不是对象或数组，什么都不会发生，
    // 否则就进行劫持
    observe(value);
    // 进行劫持
    Object.defineProperty(data, key, {
      get() {
        // 简单返回
        return value;
      },
      set(newVal) {
        // 判断新旧值是否不同
        if (newVal !== value) {
          // 新值做劫持
          observe(newVal);
          // 赋值
          value = newVal;
          // 通知变化
          notice();
        }
      }
    });
  });
}

```

以上就是vue 2的主要劫持方法的超简化版，vue 2里面做个很多额外判断
- 比如会判断能不能用__proto__
- 比如如果要劫持的属性本身已经定义了getter或setter，就要根据情况进一步讨论
- 比如会考虑属性的configurable配置，writable配置。

## vue2 用Object.defineProperty做数据劫持的缺点：

- Object.defineProperty不具备监听数组的能力，需重新定义数组的原型来达到响应式。
- Object.defineProperty 无法检测到对象属性的添加和删除 。
- Object.defineProperty监听对象的属性，颗粒度小，消耗更大。
- Vue初始化实例时对data进行劫持，属性必须在data对象上存在才能让Vue将它转换为响应式。
- 深度监听需要一次性递归，对性能影响比较大。
