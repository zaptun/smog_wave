---
layout: post
filename: 2016-11-13-Chrome DevTools Timeline
title: Chrome DevTools Timeline
date: 2016-11-13 23:21:22 +0800
categories: Chrome
tags: DevTools Timeline
---

Timeline算是一个快捷性能优化工具

Timeline主要有4个视窗，分别有不同的功能：

1. **工具栏(Controls)** : 提供录制，清除记录，配置录制过程中需要捕捉哪些数据的功能。
2. **概览(Overview)** : 页面性能的概览图，通过此图可以大致的分析页面。
3. **火焰图(Flame Chart)** : 展示了JavaScript的调用堆栈信息。上图中还可以看到三条垂直的虚线，其中蓝线表示COMConentLoaded事件，绿线表示第一次绘制，红线表示load事件，由此也可以看出COMContentLoaded事件比load事件要早不少。
4. **详情(Details)** :选中某个事件，会显示该事件的信息，如果没有选中任何事件，就会显示选中时间区段的帧信息

![image](../images/post/chrome01.png)

### 1. 视窗

![image](../images/post/chrome02.png)

在Overview 概览这个小视窗里包含了三部分图形：

1. FPS：每秒的帧数，绿色条越高，表示FPS值越高，通常上面附带红色块的帧表示该帧时间过长(jank)，可能需要优化。

2. CPU：CPU资源，面积图表示不同事件对CPU资源的消耗。

3. NET：每种颜色条代表不同的资源，条越长表示加载资源耗时越长，每根条上颜色浅的部分表示请求等待时间，颜色深的部分表示资源传输时间。此外，HTML文件是蓝色条，脚本文件是黄色条，样式文件是紫色条，媒体文件是绿色条，其他的是灰色条，网络请求部分更详细的信息建议查看Network。

### 2. 录制

点击小黑点开始录制，再次点击停止录制，Chrome DevTools还人性化的提供了一些小彩蛋：在Timeline直接刷新页面，会自动开始录制页面加载过程；录制结束，会自动定位到可能需要优化的部分。

当然，录制还是有一些小技巧：

* 录制时间尽可能短：便于分析
* 操作要简单：每次录制尽量保证简单的操作
* 禁止浏览器缓存：通过Chrome DevTools > Network > Disable cache禁止缓存
* 禁掉插件：去除插件对录制过程的影响，禁掉插件觉得很费事，可用隐私模式

#### 2.1 JS Profile选项

勾选Chrome DevTools > Timeline > JS Profile，然后录制，可以捕捉JavaScript堆栈调用信息

![image](../images/post/chrome03.png)

#### 2.2 Paint选项

打开Chrome DevTools > Timeline > JS Profile，然后录制，可以捕捉绘制信息。选中某个Paint事件，就可以查看其绘制详情

![image](../images/post/chrome04.png)

别忘了前文提到过的Chrome DevTools > ESC > Rendering > Enable paint flashing的功能，能提供很直观的Paint感受，但凡发生Paint的区域，都会闪烁一下

![image](../images/post/chrome05.png)

## 3. 详情视窗details 

选中Flame Chart 火焰图中的事件，就可以在详情视窗中查看该事件的明细；有些tab是特定事件专有的，只会在特定事件选中后才会出现。

![image](../images/post/chrome06.png)

## 4. Timeline事件搜索

Command + F可以搜索Timeline事件，很人性化的功能，既可以很直观的看出指定时间区间内的事件数目，同时还可以很方便的过滤掉不关注的事件

![image](../images/post/chrome07.png)

## 5. Timeline事件

Timeline录制过程中包含很多事件，大致分为：加载事件、脚本事件、渲染事件、绘制事件，其中每个类别的事件都包含数个小事件，并且还拥有不同的事件属性，具体可以查看[Timeline事件文档](https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/performance-reference?hl=en)

----

原文:

[Chrome DevTools 之 Timeline，快捷性能优化工具](http://www.jianshu.com/p/b8cdcd9bfad8)