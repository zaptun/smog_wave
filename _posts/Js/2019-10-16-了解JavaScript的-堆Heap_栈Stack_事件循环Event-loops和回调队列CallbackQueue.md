---
layout: post
filename: 2019-10-16-了解JavaScript的-堆Heap_栈Stack_事件循环Event-loops和回调队列CallbackQueue
title: 了解JavaScript的-堆Heap_栈Stack_事件循环Event-loops和回调队列CallbackQueue
date: 2019-10-16 21:15:23
categories: JavaScript
tags: Heap Stack Event-loops Callback-Queue
---

JavaScript是单线程的语言，这使得它的大部分语言的不同。这是缺乏多线程应用程序的能力，而它没有处理复杂的问题，如死锁或共享变量的问题。

### 单线程?

单个线程的语言将是缺乏具有同时运行的并发进程。这意味着，如果你有一个过程，需要很长一段时间，那么它会阻止其他进程运行。出于这个原因，存在其中等待处理的响应浏览器所定义的超时。当进程确实在超时没有响应，你会看到它要求你去杀死进程或不弹出。

>不要在浏览器上运行任何需可能长时间阻塞其他功能的业务。

那么，JavaScript如何模拟它在多线程环境中运行我们的命令呢?为了回答这个问题，让我们深入了解JavaScript环境。

#### 堆

堆是定义变量时存储对象的地方(内存)。

#### 堆栈

堆栈保存我们的函数调用。每次新函数调用时，它都被推到堆栈的顶部。你可以看到你的堆栈时，你有一个JavaScript堆栈跟踪异常。

#### Web API

浏览器已经定义了API，开发人员可以使用它来进行复杂的处理，比如获取访问者的位置，定义了地理位置。api列表在链接中定义，您可以在参考文献(1)中找到该链接。