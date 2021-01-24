# Vite 的特点

## 相比vue-cli的优势

vite让html模板引入js文件用了
```html
<script type="module" src="/src/main.js"></script>
```

浏览器解析module代码，导致http请求，vite通过koa拦截返回。

vite返回不需要打包其它服务，原生ES Import直接输出提高了冷启动速度。

vite按需编译当前页面需要的组件，而不需要打包整个APP的组件

## vite内置TS的支持

内置的TS不是TS官方出的tsc cli，而是ESBuild

- Esbuild用GO语言直接编译成原生代码
- GO语言特点，它的解析和映射并发非常快
- 避免了不必要配置
- 数据转换简单快速
