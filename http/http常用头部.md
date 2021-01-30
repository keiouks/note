# http常用头部

## Accept

客户端通知服务器可以接受哪些媒体类型

Accept: text/*, image/gif, image/jpeg: q=1

---

## Accept-Charset

客户端通知服务器可以接受哪些字符集或哪些是优选字符集

Accept-Charset: iso-latin-1

---

## Accept-Encoding

客户端告知服务器它可以接受哪些编码方式

Accept-Encoding: gzip

Accept-Encoding: compress;q=0. 5, gzip; q=1

---
## Accept-Language

客户端通知服务器可接受或优选哪些语言

Accept-Language: en

Accept-Language: en-gb;q=0.5

---

## Accept-Ranges

服务器告知客户端是否接受请求资源的某个范围

Accept-Ranges: none

Accept-Ranges: bytes

---

## Allow

服务器通知客户端可以对特定资源使用哪些HTTP方法

A11ow: GET, HEAD

---

## Cache-Control

服务器告诉浏览器这个资源缓存多久

Cache-Control: no-cache

Cache-Control: max-age=600

---

## Connection

一般用来设置长连接

Connection: keep-alive

---

## client-ip

客户端告诉服务器它的ip地址，可以造假

Client-ip:209.1.33.49

---

## Content-Encoding

服务器通知客户端用了哪些类型的编码

Content-Encoding: gzip

---
## Content-Length

告诉客户端实体主体部分的长度或尺寸

Content-Length: 2417

---

## Content-MD5

服务器返回的报文主题的md5值，是base64格式，可用于验证数据完整性

Content-MD5: Q2h1Y2sgSW51ZWDIAXR5IQ=

---

## Content-Range

返回资源的数据范围

Content-Range: bytes 500-999/5400

---

## Content-Type

返回资源的媒体类型

Content-Type：text/html

---

## Cookie

告诉服务器cookie

---

## Date

服务器创建报文的日期和时间

Date: Tue, 3 Oct 1997 02: 15: 31 GMT

---

## ETag

缓存机制，服务器告诉客户端资源的编码，用于后续判断资源是否有改变

ETag: "11e92a-457b-31345aa"

---

## Expires

缓存机制，服务器告诉客户端资源的有效日期

Expires: Thu, 03 Oct 1997 17: 15: 00 GMT

---

## Host

客户端告诉服务器主机名

Host: www.hotbot.com:80

---

## If-Modified-since

缓存机制，客户端返回资源上次修改时间

If-Modified-Since: Thu, 03 Oct 1997 17: 15: 00 GMT

---

## if-None-Match

缓存机制，客户端告诉服务器资源的编码标记，服务器判断资源是否变化

If-None-Match: "11e92a-457b-31345aa"

---

## Set-Cookie

服务器告诉客户端要设置哪些cookie值

Set-Cookie: BDRCVFR[cfqDsv-xoJY]=IdAnGome-nsnWnYPi4WUvY; path=/; domain=.baidu.com

Set-Cookie: BD_CK_SAM=1;path=/

---

## User-Agent

客户端的环境和版本信息

User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.50

---
