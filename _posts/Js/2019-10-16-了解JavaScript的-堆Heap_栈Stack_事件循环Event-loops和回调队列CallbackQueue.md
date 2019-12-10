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

![image](../images/post/event_loop01.png)

#### 堆

堆是定义变量时存储对象的地方(内存)。

#### 堆栈

堆栈保存我们的函数调用。每次新函数调用时，它都被推到堆栈的顶部。你可以看到你的堆栈时，你有一个JavaScript堆栈跟踪异常。

#### Web API

浏览器已经定义了API，开发人员可以使用它来进行复杂的处理，比如获取访问者的位置，定义了地理位置。api列表在链接中定义[^Web_API];

#### 回调队列
当进程完成其工作（例如xhr调用）时，它将被放入回调队列中。堆栈为空后，事件循环进程将触发回调队列，这意味着该进程在该队列中等待，直到堆栈为空。一旦我们的堆栈没有函数调用，就会从回调队列中弹出一个进程并将其推入堆栈。

#### 事件循环简单setTimeout示例

![image](../images/post/event_loop02.png)

以上示例的预期输出是什么？它从console.log开始，然后继续执行setTimeout函数，我们希望通过给定“ 0”超时然后立即另一个console.log 立即运行（？）

>setTimeout是一些特殊的东西。ECMAScript规范中未定义它。它是一个Web API[^setTimeout]。它异步工作。给定的超时时间不保证该功能将在给定的时间后工作，但保证它至少要等待给定的时间。因此setTimeout（fn，0）不会立即启动，但将至少等待零毫秒。

![image](../images/post/event_loop03.gif)

让我们解释一下在上面的代码段中运行时的行为。

1. 我们的第一个console.log（“ Murat”）将被压入堆栈，因为我们正在进行函数调用。
2. 变量将保存在堆（内存）中
3. 因为它不是异步调用，所以它将输出给定的参数
4. 第一个console.log函数将从堆栈中删除，并且堆将为空
5. setTimeout函数将被调用。因此它将被推入堆栈
6. 它是一个异步函数，是一个Web API函数。将其推送到Web API框，并将setTimeout函数从堆栈中删除
7. 后台的计时器将启动，以等待至少给定的时间以等待setTimeout。
8. 将调用console.log（“ Yusuf”）并将其推入堆栈，并将Yusuf存储在堆中。
9. 它将输出Yusuf。但是同时，我们的事件循环将继续检查堆栈的状态。
10. 输出Yusuf后，将从堆栈和堆中将其删除。
11. 当确定计时器已等待至少给定时间时，它将被推送到回调队列（console.log（“ Fatih”））
12. 当堆栈为空时，我们的事件循环将触发回调队列。
13. 接下来，将console.log（“ Fatih”）放入堆栈

因此，我们的输出将按照“ Murat”，“ Yusuf”，“ Fatih”的顺序排列

[^Web_API]: [Web API MDN=>https://developer.mozilla.org/en-US/docs/Web/API](https://developer.mozilla.org/en-US/docs/Web/API)

[^setTimeout]: [setTimeout规范 MDN=>https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)