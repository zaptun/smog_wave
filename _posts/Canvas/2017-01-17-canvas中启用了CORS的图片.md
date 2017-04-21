---
layout: post
filename: 2017-01-17-canvas中启用了CORS的图片
title: canvas中启用了CORS的图片
date: 2017-01-17 12:21:57 +0800
categories: Canvas
tags: Canvas
---

### 什么是“被污染”的 canvas?

尽管不通过CORS就可以在画布中使用图片，但是这会污染画布。一旦画布被污染，你就无法读取其数据。例如，你不能再使用画布的 toBlob(), toDataURL() 或 getImageData() 方法，调用它们会抛出安全错误。

这种机制可以避免未经许可拉取远程网站信息而导致的用户隐私泄露。

----

[CORS_enabled_image](https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image)