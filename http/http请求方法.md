# http请求方法

做个简单记录，方便查阅

说实话，不管http标准描述各个方法的意义是什么，实际功能还是要看服务器实现。所以，大部分情况下光get和post就够了。

- GET 向服务器请求信息，可以是文件内容，可以是任意数据
- POST 向服务器提交数据，也可以让服务器做某些操作
- HEAD 跟GET一样，但只需要返回头部信息，不需要返回body数据
- PUT 向服务器上传数据，覆盖已有某些数据或文档
- DELETE 叫服务器删除某些数据或页面
- CONNECT 用于连接代理服务器，让代理服务器能顺利连接远端目标服务器
- OPTIONS 问服务器某资源支持的http方法，同时询问服务器的性能
- TRACE 回显服务器收到的请求，主要用于测试或诊断
- PATCH 是对 PUT 方法的补充，用来对已知资源进行局部更新
