# 原生JavaScript使用ajax

## 直接上代码

```javascript
function ajax(options = {}) {
  // 请求类型
  options.type = (options.type || 'GET').toUpperCase();
  // 请求过去的数据格式
  options.dataType = (options.dataType || 'JSON').toUpperCase();
  options.timeout = +options.timeout || 5000;

  let requestData = null;
  if (options.type === 'GET') {
    // get请求在url上拼上序列化后的参数
    options.url = `${options.url}${options.url.includes('?') ? '&' : '?'}${serialize(options.data)}`;
  } else if (options.type === 'POST') {
    // post请求根据请求数据的类型做安排
    requestData = getRequestData(options.data, options.dataType);
  } else {
    throw new Error('不支持的请求类型');
  }

  // 创建xhr，这里不再兼容IE6一下低版本
  const xhr = new XMLHttpRequest();
  // 准备好定时器
  let timer = '';
  xhr.open(options.type, options.url, true);
  xhr.onreadystatechange = function() {
    // 这个状态是4的时候就是数据已经返回完并且解析好了
    // 其它状态都没有完全准备好
    // 后来新增了xhr.onload方法，相当于状态4这种情况
    if (xhr.readyState === 4) {
      // 准备好清除定时器
      clearTimeout(timer);
      const status = xhr.status;
      if ((status >= 200 && status <= 209) || (status === 304)) {
        try {
          ((typeof options.success) === 'function') && options.success(JSON.parse(xhr.responseText));
        } catch (e) {
          ((typeof options.error) === 'function') && options.error(e);
        }
      } else {
        ((typeof options.error) === 'function') && options.error(status);
      }
    }
  }

  // 设置头，设置数据类型，针对post请求的数据类型
  if (options.dataType === 'FORM') {
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  } else if (options.dataType === 'JSON') {
    xhr.setRequestHeader('Content-type', 'application/json');
  }

  // 准备好各种url，请求数据，设置好头，可以发起请求
  xhr.send(requestData);

  // 设置超时
  timer = setTimeout(function () {
    const e = new Error('time out');
    // 如果超时就调用error方法
    ((typeof options.error) === 'function') && options.error(e);
    // 终止请求。
    xhr.abort();    
  }, options.timeout);
}

function serialize (data) {
  const paramList = Object.keys(data).may((key) => (`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`));
  paramList.push(`_=${Math.random()}`.replace('.', ''));
  return paramList.join('&');
}

function getRequestData (data, dataType) {
  // 这里data默认是json格式，否则中间操作报错
  let result = null;
  if (data instanceof FormData) {
    // 数据本身就是FormData，原样返回
    result = data;
  } else if (dataType === 'FORM') {
    // FORM格式要构建FormData，再把参数加上去
    result = new FormData();
    Object.keys(data).forEach((key) => {
      result.append(key, data[key]);
    });
  } else if (dataType === 'JSON') {
    result = JSON.stringify(data);
  } else {
    result = data.toString();
  }
  return result;
}

```

总结整个过程：

1. 准备请求类型，请求的数据类型，超时时间；
2. 如果是get请求，要序列化参数，并拼到url上；
3. 如果是post请求，要根据希望的请求格式转化请求数据；
4. 初始化xhr请求，包括new一个xhr对象，open好；
5. 设置成功返回的行为，根据返回的xhr.status做不同的事情；
6. 设置请求头；
7. 发起请求，设置超时行为(可选)。

## 更多

现在比较流行用`Promise`做异步行为，所以可以进一步改装成返回`Promise`的形式。


