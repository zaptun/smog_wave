---
layout: post
filename: 2017-01-02-Js中的extends
title: Js中的extends
date: 2017-01-02 20:58:29 +0800
categories: Js
tags: Js extends
---

extends是一个新的ES6关键词，被用在类声明或者类表达式上，以创建一个类的子类

`class ChildClass extends ParentClass { ... }`

>扩展的.prototype必须是一个Object 或者 null。

```javascript
class Square extends Polygon {
  constructor(length) {
    // 这里把length传参给父类的构造方法
    // 作为父类Polygon的宽和高
    super(length, length);
    // 备注：在衍生类中使用this前必须先调用super()方法
    // 忽视这一点将会导致一个引用错误
    this.name = 'Square';
  }

  get area() {
    return this.height * this.width;
  }

  set area(value) {
    this.area = value;
  } 
}

//使用 extends 扩展内建对象
class myDate extends Date {
  constructor() {|
    super();
  }

  getFormattedDate() {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return this.getDate() + "-" + months[this.getMonth()] + "-" + this.getFullYear();
  }
}

//可以像扩展普通类一样扩展null，但是新对象的原型将不会继承 Object.prototype
class nullExtends extends null {
  constructor() {}
}

Object.getPrototypeOf(nullExtends); // Function.prototype
Object.getPrototypeOf(nullExtends.prototype) // null
```

### 兼容老浏览器

```javascript
var _extend = function(d, b) {
    if (d && b) {
        for (var p in b)
            if (b.hasOwnProperty(p)) d[p] = b[p];

        var __ = function () {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    }
    return d;
};
```

----

参考：

[extends](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)