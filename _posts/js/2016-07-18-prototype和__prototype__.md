---
layout: post
filename: 2016-07-18-prototype和__prototype__
title: prototype和__prototype__
date: 2016-07-18 16:02:02 +0800
categories: Js
tags: prototype和__prototype__
---

>JavaScript 的 **__proto__**  属性（现已 **弃用** 改为 [[Prototype]] ）,<br>根据 ECMAScript 标准，someObject.[[Prototype]] 符号是用于指派 someObject 的原型。<br> 从 ECMAScript 6 开始, [[Prototype]] 可以用[Object.getPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)和[Object.setPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)访问器来访问。

### 这里讨论下对象的内部原型( **__proto__** )和构造器的原型（prototype）的关系

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

JavaScript中有内置(build-in)构造器/对象共计12个（ES5中新加了JSON），这里列举了可访问的8个构造器。剩下如Global不能直接访问，Arguments仅在函数调用时由JS引擎创建， **Math，JSON** 是以对象形式存在的，无需new。它们的__proto__是Object.prototype。如下

```javascript
Math.__proto__ === Object.prototype  // true
JSON.__proto__ === Object.prototype  // true
```

上面说的“所有构造器/函数”当然包括自定义的。如下

```javascript
// 函数声明
function Person() {}
// 函数表达式
var Man = function() {}
console.log(Person.__proto__ === Function.prototype) // true
console.log(Man.__proto__ === Function.prototype)    // true
```

这说明什么呢？

**所有的构造器都来自于Function.prototype，甚至包括根构造器Object及Function自身。**
所有构造器都继承了Function.prototype的属性及方法。如length、call、apply、bind(ES5)


**Function.prototype也是唯一一个typeof XXX.prototype为 “function”的prototype。其它的构造器的prototype都是一个对象** 如下

```javascript
console.log(typeof Function.prototype) // function
console.log(typeof Object.prototype)   // object
console.log(typeof Number.prototype)   // object
console.log(typeof Boolean.prototype)  // object
console.log(typeof String.prototype)   // object
console.log(typeof Array.prototype)    // object
console.log(typeof RegExp.prototype)   // object
console.log(typeof Error.prototype)    // object
console.log(typeof Date.prototype)     // object
console.log(typeof Object.prototype)   // object
```

知道了所有构造器（含内置及自定义）的__proto__都是Function.prototype，那Function.prototype的__proto__是谁呢？

相信都听说过JavaScript中函数也是一等公民，那从哪能体现呢？如下

```javascript
console.log(Function.prototype.__proto__ === Object.prototype) // true
```

这说明所有的构造器也都是一个普通JS对象，可以给构造器添加/删除属性等。同时它也继承了Object.prototype上的所有方法：toString、valueOf、hasOwnProperty等。

最后Object.prototype的__proto__是谁？ 

```javascript
Object.prototype.__proto__ === null  // true
```

已经到顶了，为null

### 所有对象的__proto__都指向其构造器的prototype

上面测试了所有内置构造器及自定义构造器的__proto__，下面再看看所有这些构造器的实例对象的__proto__指向谁？

先看看JavaScript引擎内置构造器

```javascript
var obj = {name: 'jack'}
var arr = [1,2,3]
var reg = /hello/g
var date = new Date
var err = new Error('exception')
 
console.log(obj.__proto__ === Object.prototype) // true
console.log(arr.__proto__ === Array.prototype)  // true
console.log(reg.__proto__ === RegExp.prototype) // true
console.log(date.__proto__ === Date.prototype)  // true
console.log(err.__proto__ === Error.prototype)  // true
```

再看看自定义的构造器，这里定义了一个Person

```javascript
function Person(name) {
    this.name = name
}
var p = new Person('jack')
console.log(p.__proto__ === Person.prototype) // true
```

p是Person的实例对象，p的内部原型总是指向其构造器Person的prototype。

每个对象都有一个constructor属性，可以获取它的构造器，因此以下打印结果也是恒等的

```javascript
function Person(name) {
    this.name = name
}
var p = new Person('jack')
console.log(p.__proto__ === p.constructor.prototype) // true
```

上面的Person没有给其原型添加属性或方法，这里给其原型添加一个getName方法

```javascript
function Person(name) {
    this.name = name
}
// 修改原型
Person.prototype.getName = function() {}
var p = new Person('jack')
console.log(p.__proto__ === Person.prototype) // true
console.log(p.__proto__ === p.constructor.prototype) // true
```

可以看到p.__proto__与Person.prototype，p.constructor.prototype都是恒等的，即都指向同一个对象

如果换一种方式设置原型，结果就有些不同了

```javascript
function Person(name) {
    this.name = name
}
// 重写原型
Person.prototype = {
    getName: function() {}
}
var p = new Person('jack')
console.log(p.__proto__ === Person.prototype) // true
console.log(p.__proto__ === p.constructor.prototype) // false
```


这里直接重写了Person.prototype（注意：上一个示例是修改原型）。输出结果可以看出p.__proto__仍然指向的是Person.prototype，而不是p.constructor.prototype。

**因为这个时候，p.constructor 指向的是Object函数，而上一个指向的是Person函数**

这也很好理解，给Person.prototype赋值的是一个对象直接量{getName: function(){}}，使用对象直接量方式定义的对象其构造器（constructor）指向的是根构造器Object，Object.prototype是一个空对象{}，{}自然与{getName: function(){}}不等。如下

```javascript
var p = {}
console.log(Object.prototype) // 为一个空的对象{}
console.log(p.constructor === Object) // 对象直接量方式定义的对象其constructor为Object
console.log(p.constructor.prototype === Object.prototype) // 为true，不解释
```

上面代码中用到的__proto__目前在IE6/7/8/9中都不支持。IE9中可以使用 **Object.getPrototypeOf(ES5)** 获取对象的内部原型。

```javascript
var p = {}
var __proto__ = Object.getPrototypeOf(p)
console.log(__proto__ === Object.prototype) // true
```

参考: <br>
[JavaScript中__proto__与prototype的关系](http://www.cnblogs.com/snandy/archive/2012/09/01/2664134.html)