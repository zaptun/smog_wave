---
layout: post
filename: 2016-11-16-Shell echo命令
title: Shell echo命令
date: 2016-11-16 18:03:15 +0800
categories: Shell
tags: echo Shell
---

echo是Shell的一个内部指令，用于在屏幕上打印出指定的字符串。命令格式：`echo arg`

可以使用echo实现更复杂的输出格式控制。

#### 1. 显示转义字符

```shell
echo "\"It is a test\""
#结果将是： "It is a test"
```

>双引号也可以省略。

#### 2. 显示变量

```shell
name="OK"
echo "$name It is a test"
#结果将是： OK It is a test
```

>同样双引号也可以省略。

#### 3. 如果变量与其它字符相连的话，需要使用大括号（{ }）

```shell
mouth=8
echo "${mouth}-1-2009"
#结果将是： 8-1-2009
```

#### 4. 显示换行

```shell
echo -e "OK!\n"
```

#### 5. 显示不换行

```shell
echo "OK!\c"
echo "It is a test"
#输出： OK!It si a test
```

#### 6. 显示结果重定向至文件

```shell
echo "It is a test" > myfile
```

#### 7. 原样输出字符串

```shell
#若需要原样输出字符串（不进行转义），请使用单引号。例如：
echo '$name\"'
```

#### 8. 显示命令执行结果

```shell
echo `date`
#结果将显示当前日期
```

从上面可看出，双引号可有可无，单引号主要用在原样输出中。

