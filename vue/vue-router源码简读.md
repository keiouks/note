# vue-router源码简读

用vue-router的时候会先做这个步骤：

```javascript
import VueRouter from 'vue-router';
// use(VueRouter)的时候，VueRouter是一个对象，
// 所以就会调用VueRouter的install方法，参数就是Vue对象。
Vue.use(VueRouter);
```

看看install源码

```javascript
// src/install.js
import View from './components/view'
import Link from './components/link'

export let _Vue

export function install (Vue) {
  // 判断安装过没有，installed是接下来在函数上加的属性
  if (install.installed && _Vue === Vue) return
  install.installed = true
  // 用一个变量记录Vue对象
  _Vue = Vue
  // 判断一个变量定义了没有
  const isDef = v => v !== undefined
  // 注册用的方法
  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }
  // 给Vue加全局mixin
  Vue.mixin({
    beforeCreate () {
      // Vue刚开始运行就给它加上_router和_route属性  
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
  // 给Vue加$router属性，指向上面刚初始化时给Vue加的_router对象
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  // 再定义$route
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
  // 定义两个组件，两个跟路由跳转有关的组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```

```javascript
// src/index.js
// 一开始先确定了模式，默认是'hash'，
let mode = options.mode || 'hash'
// 如果是history，但浏览器不支持HTML5History，同时，没有设置不准fallback
// 那么，fallback就会为true，意思是后退，后退为用hash模式
this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
if (this.fallback) {
  mode = 'hash'
}
// 如果不在浏览器环境，就用抽象模式，
// 判断是否在浏览器环境主要看有没有全局window对象
if (!inBrowser) {
  mode = 'abstract'
}
this.mode = mode
...
...
// 不同的模式，就创建不同的history对象
switch (mode) {
  case 'history':
    this.history = new HTML5History(this, options.base)
    break
  case 'hash':
    this.history = new HashHistory(this, options.base, this.fallback)
    break
  case 'abstract':
    this.history = new AbstractHistory(this, options.base)
    break
  default:
    if (process.env.NODE_ENV !== 'production') {
      assert(false, `invalid mode: ${mode}`)
    }
}
```

三个不同的history对象，看看关键代码

```javascript
// HTML5History
// 设置监听相应事件
window.addEventListener('popstate', e => {
  ...
  ...
});
...
// go直接封装原生
go (n: number) {
  window.history.go(n)
}
...
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  // 先调拨父类基础方法，完成各种生命周期钩子和组件替换
  this.transitionTo(location, route => {
    // 这个封装的方法里面调用原生history.pushState 
    pushState(cleanPath(this.base + route.fullPath))
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}
...
// 跟push几乎做了一样的事情，
replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    // 这里也是封装了原生history.replaceState
    replaceState(cleanPath(this.base + route.fullPath))
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}
```

```javascript
// HashHistory
// 本质上做的事情跟HTML5History差不多，只不过要获取和判断url上的hash
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  // 一样调用了这个方法，完成各种生命周期钩子和组件替换
  this.transitionTo(location, route => {
      // 不一样的是调用了pushHash 
      pushHash(route.fullPath)
      handleScroll(this.router, route, fromRoute, false)
      onComplete && onComplete(route)
    },
    onAbort
  )
}
...
function pushHash (path) {
  // 如果支持HTML5History的pushState，那还是用跟HTML5History一样的pushState方法
  if (supportsPushState) {
    // 要自己拼好带hash的url
    pushState(getUrl(path))
  } else {
    // 否则直接改变hash
    window.location.hash = path
  }
}
...
// 跟pushHash一样的理念
function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path))
  } else {
    // 只不过replace是替换整个url，要自己拼好带hash的url
    window.location.replace(getUrl(path))
  }
}
```

```javascript
// AbstractHistory
// 自己维护一个栈，自己完成进栈出栈的事情
constructor (router: Router, base: ?string) {
  super(router, base)
  // 记录整个出入栈过程的栈
  this.stack = []
  // 栈顶指针
  this.index = -1
}
...
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  // 一样是父类的方法，完成各种生命周期钩子和组件替换
  this.transitionTo(location, route => {
      // 整个route进栈
      this.stack = this.stack.slice(0, this.index + 1).concat(route)
      this.index++
      onComplete && onComplete(route)
    },
    onAbort
  )
}
replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  this.transitionTo(location, route => {
      // 替换了最后一个元素
      this.stack = this.stack.slice(0, this.index).concat(route)
      onComplete && onComplete(route)
    },
    onAbort
  )
}
```
