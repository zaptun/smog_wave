---
layout: post
filename: 2021-12-22-nginx重写url配置
title: nginx重写url配置
date: 2021-12-22 11:20:01 +0800
categories: 
tags: 
---

# nginx URL重写（rewrite）配置

```
URL重写有利于网站首选域的确定，对于同一资源页面多条路径的301重定向有助于URL权重的集中
```

## 1. Nginx URL重写（rewrite）介绍



```undefined
和apache等web服务软件一样，rewrite的组要功能是实现RUL地址的重定向。
Nginx的rewrite功能需要PCRE软件的支持，即通过perl兼容正则表达式语句进行规则匹配的。
默认参数编译nginx就会支持rewrite的模块，但是也必须要PCRE的支持
```

## 2. rewrite语法格式及参数语法:



```bash
rewrite是实现URL重写的关键指令，根据regex (正则表达式)部分内容，
重定向到replacement，结尾是flag标记。


rewrite    <regex>    <replacement>    [flag];
关键字      正则        替代内容         flag标记

关键字：其中关键字error_log不能改变
正则：perl兼容正则表达式语句进行规则匹配
替代内容：将正则匹配的内容替换成replacement
flag标记：rewrite支持的flag标记

rewrite参数的标签段位置：
server,location,if

flag标记说明：
last  #本条规则匹配完成后，继续向下匹配新的location URI规则
break  #本条规则匹配完成即终止，不再匹配后面的任何规则
redirect  #返回302临时重定向，浏览器地址会显示跳转后的URL地址
permanent  #返回301永久重定向，浏览器地址栏会显示跳转后的URL地址
```

### 2.1. nginx rewrite变量，常用于匹配HTTP请求头信息、浏览器主机名、URL



```css
HTTP headers:HTTP_USER_AGENT, HTTP_REFERER, HTTP_COOKIE, HTTP_HOST, HTTP_ACCEPT；
connection & request: REMOTE_ADDR, QUERY_STRING；
server internals: DOCUMENT_ROOT, SERVER_PORT, SERVER_PROTOCOL；
system stuff: TIME_YEAR, TIME_MON, TIME_DAY。
详解如下:
HTTP_USER_AGENT      用户使用的代理，例如浏览器；
HTTP_REFERER         告知服务器，从哪个页面来访问的；
HTTP_COOKIE          客户端缓存，主要用于存储用户名和密码等信息；
HTTP_HOST            匹配服务器ServerName域名；
HTTP_ACCEPT          客户端的浏览器支持的MIME类型；      
REMOTE_ADDR          客户端的IP地址
QUERY_STRING         URL中访问的字符串；
DOCUMENT_ROOT        服务器发布目录；
SERVER_PORT          服务器端口；
SERVER_PROTOCOL      服务器端协议；
TIME_YEAR            年；
TIME_MON             月；
TIME_DAY              日；
```

## 3. 例子

### 3.0. 较难场景



```bash
第一种:
将uri中的所有空格替换为"_",连续的空格替换为一个"_"放到proxy_pass之前,
切记, 下述表达式中第一个括号后有空格
rewrite '^(\S+) +(\S+)(.*)' $1_$2$3 last;
```

### 3.1. demo01



```bash
rewrite ^/(.*) http://www.zy.com/$1 permanent;
说明：                                        
rewrite为固定关键字，表示开始进行rewrite匹配规则。
regex部分是 ^/(.*) ，这是一个正则表达式，匹配完整的域名和后面的路径地址。
replacement部分是http://www.zy.com/$1。其中$1是取自regex部分()里的内容,匹配成功后跳转到的URL。
flag部分 permanent表示永久301重定向标记，即跳转到新的http://www.zy.com/$1 地址上。
```

### 3.2. demo02

```
vi编辑虚拟主机配置文件
```



```undefined
vi conf/vhost/www.abc.com.conf
修改文件内容方法1
```



```cpp
server {
        listen 80;
        server_name abc.com;
        rewrite ^/(.*) http://www.abc.com/$1 permanent;
}
server {
        listen 80;
        server_name www.abc.com;
        location / {
                root /data/www/www;
                index index.html index.htm;
        }
        error_log    logs/error_www.abc.com.log error;
        access_log    logs/access_www.abc.com.log    main;
}
修改文件内容方法2
```



```ruby
server {
        listen 80;
        server_name abc.com www.abc.com;
        if ( $host != 'www.abc.com'  ) {
                rewrite ^/(.*) http://www.abc.com/$1 permanent;
        }
        location / {
                root /data/www/www;
                index index.html index.htm;
        }
        error_log    logs/error_www.abc.com.log error;
        access_log    logs/access_www.abc.com.log    main;
}
```

### 3.3. 将[zy.com](https://links.jianshu.com/go?to=http%3A%2F%2Fzy.com)跳转至[www.zy.com](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.zy.com)



```bash
if ($host = zy.com' ) {
     #其中$1是取自regex部分()里的内容,匹配成功后跳转到的URL。
     rewrite ^/(.*)$  http://www.zy.com/$1  permanent；
}
```

### 3.4. 访问[www.zy.com](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.zy.com)跳转[www.test.com/index01.html](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.test.com%2Findex01.html)



```jsx
rewrite   ^/$  http://www.test.com/index01.html  permanent；
```

### 3.5. 访问/zy/test01/跳转至/newindex.html，浏览器地址不变



```ruby
rewrite   ^/zy/test01/$     /newindex.html     last；
```

### 3.6. 多域名跳转到[www.zy.com](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.zy.com)



```ruby
if ($host != ‘www.jfedu.net’ ) {
    rewrite ^/(.*)$  http://www.zy.com/$1  permanent；
}
```

### 3.7. 访问文件和目录不存在跳转至index.php



```ruby
if ( ! -e $request_filename ) {
    rewrite  ^/(.*)$  /index.php  last；
}
```

### 3.8. 目录对换 /xxxx/123456 ====> /xxxx?id=123456



```ruby
rewrite    ^/(.+)/(\d+)      /$1?id=$2       last；
```

### 3.9. 判断浏览器User Agent跳转



```ruby
if( $http_user_agent  ~ MSIE) {
    rewrite ^(.*)$ /ie/$1 break；
}
```

### 3.10. 禁止访问以.sh,.flv,.mp3为文件后缀名的文件



```ruby
location ~ .*\.(sh|flv|mp3)${
       return 403；
} 
```

### 3.11. 将移动用户访问跳转至移动端

```ruby
if ( $http_user_agent ~* "(Android)|(iPhone)|(Mobile)|(WAP)|(UCWEB)" ){
      rewrite ^/$    http://m.jfedu.net/    permanent；
}
```

### 3.12. 访问/10690/zy/123跳转至/index.php?tid/10690/items=123，[0-9]表示任意一个数字，+表示多个，(.+)表示任何多个字符__

```ruby
rewrite   ^/([0-9]+)/zy/(.+)$     /index.php?tid/$1/items=$2     last;
```

### 3.13. 匹配URL访问字符串跳转

```bash
if ($args ~* tid=13){
    return 404；
}
```

### 3.14. alias和root的区别

- **root** 指令只是将搜索的根设置为 root 设定的目录，即不会截断 uri，而是使用原始 uri 跳转该目录下查找文件
  
- **alias** 指令则会截断匹配的 uri，然后使用 alias 设定的路径加上剩余的 uri 作为子路径进行查找，支持正则表达式

如果一个项目是vue，

**root匹配**

1. 直接根域名指到vue项目目录, 如：http://www.demo.com
```nginx
location @router {
    rewrite ^.*$ /index.html last;
}

location / {
    root /data/nginx/html/vueProjectA/;
    try_files $uri $uri/ @router;
    index index.html index.htm;
}
```

2. 域名二级目录指到vue项目目录, 如：http://www.demo.com/vuedemo/

>注：服务器 /data/nginx/html/vueProjectA/ 里面要有一个 vuedemo 文件夹

```nginx
location /vuedemo {
    root   /data/nginx/html/vueProjectA/;
    index  index.html index.htm;
    if (!-e $request_filename) {
        rewrite ^/(.*) /vuedemo/index.html last;
        break;
    }
}
```

或者用 try_files

```nginx
location @router {
    rewrite ^.*$ /vuedemo/index.html last;
}
location /vuedemo {
    root  /data/nginx/html/vueProjectA/;
    index  index.html index.htm;
    try_files $uri $uri/ @router;
}
```

**alias匹配**

一般用在域名二级目录和服务器文件夹名称不一样的情况，如：http://www.demo.com/vuedemo/ 只想指到服务器 /data/nginx/html/vueProjectA/，就用alias截断匹配的路径。

>Nginx的 alias 和try_files 两个之间存在互斥，不能同时配置。

```nginx
location /vuedemo {
    alias  /data/nginx/html/vueProjectA/;
    index  index.html index.htm;
    if (!-e $request_filename) {
        rewrite ^/(.*) /vuedemo/index.html last;
        break;
    }
}
```


## 4.rewrite 企业应用场景



```ruby
>> 可以调整用户浏览的URL，看起来更规范，合乎开发及产品人员的需求。

>> 为了让搜索引擎搜录网站内容及用户体验更好，企业会将动态URL地址伪装成静态地址提供服务。

>> 网址换新域名后，让旧的访问跳转到新的域名上。例如，访问京东的360buy.com会跳转到jd.com

>> 根据特殊变量、目录、客户端的信息进行URL调整等
```

## 匹配方式

### 精准匹配

- `location = /uri` 表示精准匹配，只要完全匹配上才能生效。记住只会匹配一个。

### 字符串匹配

最长匹配原则

- `location /uri` 不带任何修饰符，表示前缀匹配，忽略大小写。但是优先级在正则匹配之后

- `location ^~ /uri` 开头对URL路径进行前缀匹配，并且在正则之前。一旦匹配到最长匹配，则不再查找其他匹配项

### 正则匹配

- `location ~ pattern` 开头表示区分大小写的正则匹配
- `location ~* pattern` 开头表示不区分大小写的正则匹配，如果有多个location匹配，则选择匹配最长的那个

### 通用匹配

- `location /` 通用匹配，任何未匹配到其他location的请求都会匹配到

### 优先级

=(精确匹配) > ^~(普通字符匹配) > ~*(正则匹配) > 完全路径 > /

----

参考

[Nginx的alias/root/try_files实战](https://zhuanlan.zhihu.com/p/481297435)