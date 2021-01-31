# cluster创建的多个worker为什么能监听同一个端口

先上代码

```javascript
const cluster = require('cluster');
const os = require('os');
const http = require('http');
 
if (cluster.isMaster) {
 
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
 
} else {
 
  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

```

从代码看出通过cluster创建了跟cpu数目一样的worker，每一个worder都开启了服务并且都监听了同一个端口。

多个进程之间应该不能监听同一个端口才对。

## 事实

- worker确实建立了http服务，但并没有监听那个端口
- worker告诉master，让master代替它监听那个端口
- 当有请求到master的时候，master就把请求扔给worker来进行处理
- 对应同一个端口的多个worker，master采用round-robin轮询来分配请求
