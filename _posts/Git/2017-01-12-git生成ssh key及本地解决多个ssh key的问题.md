---
layout: post
filename: 2017-01-12-git生成ssh key及本地解决多个ssh key的问题
title: git生成ssh key及本地解决多个ssh key的问题
date: 2017-01-12 19:07:42 +0800
categories: Git
tags: SSH Git
---

ssh是一种网络协议，用于计算机之间的加密登录。ssh原理及应用可参考：
[SSH原理与运用（一）：远程登录](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)

### 具体的用法

#### 1. 配置git用户名和邮箱

以配置github的ssh key为例：

```shell
git config user.name "用户名" 
git config user.email "邮箱"
```

>在config后加上 --global 即可全局设置用户名和邮箱

#### 2. 生成ssh key

```shell
ssh-keygen -t rsa -C "邮箱"
```

>然后根据提示连续回车即可在~/.ssh目录下得到id_rsa和id_rsa.pub两个文件，id_rsa.pub文件里存放的就是我们要使用的key

#### 3. 上传key

```shell
clip < ~/.ssh/id_rsa.pub
```

1. 复制key到剪贴板
2. 登录github
3. 点击右上方的Accounting settings图标
4. 选择 SSH key
5. 点击 Add SSH key

#### 4. 测试是否配置成功

```shell
ssh -T git@github.com
```

如果配置成功，则会显示：<br />
Hi username! You’ve successfully authenticated, but GitHub does not provide shell access

### 解决本地多个ssh key问题

有的时候，不仅github使用ssh key，工作项目或者其他云平台可能也需要使用ssh key来认证，如果每次都覆盖了原来的id_rsa文件，那么之前的认证就会失效。这个问题我们可以通过在**~/.ssh目录下增加config文件**来解决

#### 1. 第一步依然是配置git用户名和邮箱

#### 2. 生成ssh key时同时指定保存的文件名

```shell
ssh-keygen -t rsa -f ~/.ssh/id_rsa.github -C "email"
```

上面的id_rsa.github就是我们指定的文件名，这时~/.ssh目录下会多出**id_rsa.github**和**id_rsa.github.pub**两个文件，id_rsa.github.pub里保存的就是我们要使用的key

#### 3. 新增并配置config文件

如果config文件不存在，先添加；存在则直接修改

```shell
touch ~/.ssh/config
```

在config文件里添加如下内容(User表示你的用户名)

```shell
Host *.github.com 
    IdentityFile ~/.ssh/id_rsa.github
    User test@github.com
```

#### 4. 上传key到云平台后台(省略)

#### 5. 测试ssh key是否配置成功