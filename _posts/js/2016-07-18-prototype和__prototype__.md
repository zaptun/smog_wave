---
layout: post
filename: 2016-07-18-prototype和__prototype__
title: prototype和__prototype__
date: 2016-07-18 16:02:02 +0800
categories: Js
tags: prototype
---

### 这里讨论下对象的内部原型(__proto__)和构造器的原型（prototype）的关系

**所有构造器/函数的__proto__都指向Function.prototype，它是一个空函数（Empty function）**

```javascript
Number.__proto__ === Function.prototype  // true
Boolean.__proto__ === Function.prototype // true
String.__proto__ === Function.prototype  // true
Object.__proto__ === Function.prototype  // true
Function.__proto__ === Function.prototype // true
Array.__proto__ === Function.prototype   // true
RegExp.__proto__ === Function.prototype  // true
Error.__proto__ === Function.prototype   // true
Date.__proto__ === Function.prototype    // true
```