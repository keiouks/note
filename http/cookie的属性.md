# cookie的属性

## name

cookie的名称。

## value

cookie的取值。

## domain

cookie所属的域名，每个域名只能设置和读取自己域名或者更高级域名的cookie，比如，`abc.com`只能设置和读取`abc.com`这个域名下的cookie。`ee.abc.com`能设置和读取`ee.abc.com`和`abc.com`下的cookie。`xx.abc.com`不能读取和设置`ee.abc.com`这个域名的cookie，但可以读取和设置`abc.com`下的cookie。

## path

给一个cookie设置一个path，那么，该path下的页面和该path的子path下的页面都可以访问。但该path的父path和该path的兄弟path以及兄弟path的子path都不能访问。比如设置path为`/test/`，
那么`/test/index.html`页面可以访问该cookie，`/test/abc/index2.html`页面也可以访问，
`/index3.html`不能访问，`/xxx/index4.html`不能访问。要想一个cookie所有path都能访问，可以设置它的path为`/`。

## expires/Max-Age

超时时间，设置一个时间，超过该时间此cookie失效。不设置默认为session，浏览器关闭就失效。

## size

cookie大小，其实是name和value的字符数之和，比如一个cookie的name是`xx`，value是`123`，那么size就是5。

## http

设置是否httponly，如果设置为true，就是httponly，则只有http请求头会带上cookie，通过JavaScript代码获取不到。JavaScript代码指的就是`document.cookie`。

## secure

设置是否只有https可以访问该cookie。

## SameSite

相对新的属性，针对csrf攻击
- 设置成`Strict`，任何跨域请求都不会带上cookie，因此，在一个网站通过链接请求另一个网站时的get请求也不会带cookie，跳转过去总是未登录。
- 设置成`Lax`，像a标签，get表单还是会带上cookie，但post请求，iframe的链接，ajax，image都不会带cookie。
- `none`，要同时设置secure才会生效。

