---
layout: post
filename: 2016-11-21-使用Charles抓https请求包
title: 使用Charles抓https请求包
date: 2016-11-21 13:00:50 +0800
categories: Http
tags: 抓https请求 Charles
---

### 1.电脑配置

#### 1.1 安装证书

Help -> Install Charles CA SSL…

![image](../images/post/charles01.png)

在弹出的**钥匙串访问**,设置始终信任

![image](../images/post/charles02.png)

#### 1.2 代理配置

Proxy -> Proxy Settings…

`注意: *：443`

![image](../images/post/charles03.png)

![image](../images/post/charles04.png)

![image](../images/post/charles05.png)

### 2. 移动设备配置

前面的步骤和PC端一样，然后要在手机上安装证书

Safari访问地址: `https://www.charlesproxy.com/assets/legacy-ssl/charles.crt` 安装证书.

然后设置代理即可
