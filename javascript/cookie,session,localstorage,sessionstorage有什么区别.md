# cookie,session,localstorage,sessionstorage有什么区别

## cookie

- 存储在浏览器
- 服务器可以通过http响应设置cookie
- 向服务器发请求时会带上cookie
- cookie存储大小较小，具体看浏览器，一般有几KB
- 一般会设置有效期
- js原生没有现成的操作方法，只能自己封装或用第三方库进行操作

## session

- 一般存储在服务器
- 客户端传一个session id然服务器找到对应session信息从而验证身份
- session id一般存放在cookie

## localstorage

- 浏览器本地存储
- 存储的信息不会随着请求发给服务器
- 存储容量较大，具体看浏览器，一般有几MB
- 长期有效，需要通过代码或浏览器设置删除
- js原生有现成的访问方法，方便访问

## sessionstorage

- 跟localstorage一样，但如果关闭当前窗口就会失效
