---
layout: post
filename: 2016-12-30-Js中的getter和setter
title: Js中的getter和setter
date: 2016-12-30 15:59:23 +0800
categories: Js
tags: Js getter setter
---

>在开发中，我遇到这样一个问题：给一个对象建立一个只读属性，然后我们看看将会发生什么。

简单的说getter就是给获取一个对象属性时触发的方法函数，setter就是给这个属性赋值时触发的方法函数；

### 一. 给一个对象建立一个只读属性

>其实就是给这个属性绑定一个动态方法计算后的值主要利用js中getter和setter的特性,试图赋给getter的属性赋新值的话不会改变该值.

在对象建一个**只读**属性，我们有四种方法：

1. **Object.prototype.__defineGetter__()**  //已经废弃，不推荐使用
2. **getter(get operator)**           //字面量中使用get语法
3. **Object.defineProperty()**
3. **Object.defineProperties()**

>注：方法2对象字面量中的 get 语法只能在**新建一个对象时**使用，其它方法可以为一个已经存在的对象设置（新建或修改）访问器属性。

>在Gecko内核中还有两个相关的方法，watch和unwatch，只顺便提下，感兴趣的朋友可以自己去查资料

#### 1. Object.prototype.__defineGetter__()

**__defineGetter__** 方法可以将一个函数绑定在当前对象的指定属性上，当那个属性的值被读取时，你所绑定的函数就会被调用

```javascript
/**
 * @param  {string} prop 一个字符串，表示指定的属性名
 * @param  {function} func 一个函数，当 prop 属性的值被读取时自动被调用
 */
obj.__defineGetter__(prop, func){
    // ...
}

// 请注意，该方法是非标准的：
//eg:
var o = {};
o.__defineGetter__('gimmeFive', function() { return 5; });
console.log(o.gimmeFive); // 5
```

#### 2. getter(get operator)

**get** 语句作为函数绑定在对象的属性上,当访问该属性时调用该函数.

```javascript
/**
 * @param  {string} prop 待绑定函数的属性的名称
 * @param  {expression} expression 从ECMAScript 6开始, 可以使用表达式作为函数名称绑定在属性上.
 */
{get prop() { ... } }
{get [expression]() { ... } }

//eg:

var o = {
  a: 7,
  get b() { return this.a + 1; },
  set c(x) { this.a = x / 2; }
};

//eg:

var log = ['test'];
var obj = {
  get latest () {
    if (log.length == 0) return undefined;
    return log[log.length - 1]
  }
}
console.log (obj.latest); // Will return "test".

//ES6 使用计算后的属性名
var expr = "foo";

var obj = {
  get [expr]() { return "bar"; }
};

console.log(obj.foo); // "bar"
```

**注意,试图赋给latest新值的话不会改变该值.**

使用getter语法时应注意以下问题:

* 可以使用数值或字符串作为标识;
* 必须不带参数;
* 在对象字面量中,同一个属性不能有两个get,也不能既有get又有属性键值对(不允许使用 { get x() { }, get x() { } } 和 { x: ..., get x() { } } ).

#### 3. Object.defineProperty()

**Object.defineProperty()** 方法会直接在一个对象上定义一个新属性，或者修改一个已经存在的属性， 并返回这个对象。

```javascript
/**
 * @param  {object} obj        需要定义属性的对象
 * @param  {string} prop       需定义或修改的属性的名字
 * @param  {object} descriptor 将被定义或修改的属性的描述符
 * @return {object}            返回传入函数的对象，即第一个参数obj
 */
Object.defineProperty(obj, prop, descriptor){
    //...
}

//eg:
使用 Object.defineProperty 方法
var o = {};
Object.defineProperty(o, 'gimmeFive', {
  get: function() {
    return 5;
  }
});
console.log(o.gimmeFive); // 5

//eg:

//扩展Data原型，定义属性year的getter和setter：
var d = Date.prototype;
Object.defineProperty(d, "year", {
  get: function() { return this.getFullYear() },
  set: function(y) { this.setFullYear(y) }
});

//通过一个Date对象使用getter和setter:
var now = new Date();
console.log(now.year); // 2000
now.year = 2001; // 987617605170
console.log(now);
// Wed Apr 18 11:13:25 GMT-0700 (Pacific Daylight Time) 2001

```

#### 4. Object.defineProperties()

>Object.defineProperties() 方法在一个对象上添加或修改一个或者多个自有属性，并返回该对象。

```javascript
/**
 * @param  {object} obj   将要被添加属性或修改属性的对象
 * @param  {object} props 该对象的一个或多个键值对定义了将要为对象添加或修改的属性的具体配置
 * @return {object}       返回传入函数的对象，即第一个参数obj
 */
Object.defineProperties(obj, props){ 
//... 
}


//eg:
var obj = {};
Object.defineProperties(obj, {
  "property1": {
    value: true,
    writable: true
  },
  "property2": {
    value: "Hello",
    writable: false
  }
  // 等等.
});
alert(obj.property2) //弹出"Hello"

//eg:
var o = { a:0 }

Object.defineProperties(o, {
    "b": { get: function () { return this.a + 1; } },
    "c": { set: function (x) { this.a = x / 2; } }
});

o.c = 10 // Runs the setter, which assigns 10 / 2 (5) to the 'a' property
console.log(o.b) // Runs the getter, which yields a + 1 or 6
```

##### 兼容版defineProperties

```javascript
function defineProperties(obj, properties)
{
  function convertToDescriptor(desc){
    function hasProperty(obj, prop){
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    function isCallable(v){
      // 如果除函数以外,还有其他类型的值也可以被调用,则可以修改下面的语句
      return typeof v === "function";
    }

    if (typeof desc !== "object" || desc === null)
      throw new TypeError("不是正规的对象");

    var d = {};
    if (hasProperty(desc, "enumerable"))
      d.enumerable = !!desc.enumerable;
    if (hasProperty(desc, "configurable"))
      d.configurable = !!desc.configurable;
    if (hasProperty(desc, "value"))
      d.value = desc.value;
    if (hasProperty(desc, "writable"))
      d.writable = !!desc.writable;
    if (hasProperty(desc, "get")){
      var g = desc.get;
      if (!isCallable(g) && g !== "undefined")
        throw new TypeError("bad get");
      d.get = g;
    }
    if (hasProperty(desc, "set")){
      var s = desc.set;
      if (!isCallable(s) && s !== "undefined")
        throw new TypeError("bad set");
      d.set = s;
    }

    if (("get" in d || "set" in d) && ("value" in d || "writable" in d))
      throw new TypeError("identity-confused descriptor");

    return d;
  }

  if (typeof obj !== "object" || obj === null)
    throw new TypeError("不是正规的对象");

  properties = Object(properties);
  var keys = Object.keys(properties);
  var descs = [];
  for (var i = 0; i < keys.length; i++)
    descs.push([keys[i], convertToDescriptor(properties[keys[i]])]);
  for (var i = 0; i < descs.length; i++)
    Object.defineProperty(obj, descs[i][0], descs[i][1]);

  return obj;
}
```

#### 二. 属性的描述符

为什么getter的属性没法修改呢，核心就是这个，属性的描述符，

**描述符必须是两种形式之一；不能同时是两者**

* 两者共同的可选键值：

    * configurable: 当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，也能够被删除。默认为 false。
    * enumerable: 当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中。默认为 false。

* 数据描述符同时具有以下可选键值：

    * value: 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
    * writable: 当且仅当该属性的 writable 为 true 时，该属性才能被赋值运算符改变。默认为 false。

* 存取描述符同时具有以下可选键值：

    * get: 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined。
    * set: 一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined。

```javascript
var o = { get gimmeFive() { return 5; } };  //创建一个属性有getter的对象
console.log(o.gimmeFive) //5
o.gimmeFive = 6;         // 给gimmeFive赋值
console.log(o.gimmeFive) //5 不会成功，因为gimmeFive只读

Object.defineProperty(o, "gimmeFive", {writable:true}) //用defineProperty改变gimmeFive属性的描述符的writable，变成true，gimmeFive就能被覆盖了
o.gimmeFive = 22;         // 给gimmeFive赋值22
console.log(o.gimmeFive) //22 gimmeFive改变

```

### 三. 给一个get属性赋值(setter/__defineSetter__)

上面已经知道给一个对象属性getter后，这个属性是只读的，那么，如果给这个只读的属性赋值操作，会怎么样？如果已经给这个属性设置了set的话，就会触发set对应的函数

#### Object.prototype.__defineSetter__()

__defineSetter__ 方法可以将一个函数绑定在当前对象的指定属性上，当那个属性被赋值时，你所绑定的函数就会被调用

这个方法和__defineGetter__一样，废弃了，就不多说了

#### setter(set operator)

**set** 语法可以将一个函数绑定在当前对象的指定属性上，当那个属性被赋值时，你所绑定的函数就会被调用.

```javascript
/**
 * @param  {string} prop 将被指定函数绑定的属性名
 * @param  {any} val 存有将要赋给 prop 的值的变量的代称
 * @param  {expression} expression 从ECMAScript 6开始, 可以使用表达式作为函数名称绑定在属性上.
 */

{set prop(val) { . . . }}
{set [expression](val) { . . . }}

//eg:
var o = {
  set current (str) {
    return this.log[this.log.length] = str;
  },
  log: []
}

//ES6 使用计算后的属性名
var expr = "foo";

var obj = {
  baz: "bar",
  set [expr](v) { this.baz = v; }
};

console.log(obj.baz); // "bar"
obj.foo = "baz";      // run the setter
console.log(obj.baz); // "baz"
```

* 使用 set 语法时请注意：

    * 它的标识符可以是 number 与 string 二者之一。
    * 它必须有一个明确的参数 （详见 Incompatible ES5 change: literal getter and setter functions must now have exactly zero or one arguments）
    * 在同一个对象中，不能为一个已有真实值的变量使用 set ，也不能为一个属性设置多个 set。
( { set x(v) { }, set x(v) { } } 和 { x: ..., set x(v) { } } 是不允许的 )

### 四.  查看setter或者getter

如果已经给一个属性设置了set或者get，要怎么查看对应的函数呢？直接链式获取set会是undefined.

所以有了**getOwnPropertyDescriptor**方法，以前对应的是**__lookupSetter__**(已经废弃)

#### Object.prototype.__lookupSetter__()

__lookupSetter__ 方法是用来返回一个对象的某个属性上绑定了 setter （设置器）的钩子函数的引用

```javascript
var obj = {
  set foo(value) {
    this.bar = value;
  }
};


// 非标准，并且不推荐使用。
obj.__lookupSetter__('foo')
// (function(value) { this.bar = value; })


// 标准且推荐使用的方式。
Object.getOwnPropertyDescriptor(obj, "foo").set;
// (function(value) { this.bar = value; })
```


#### Object.getOwnPropertyDescriptor()

Object.getOwnPropertyDescriptor() 返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）

```javascript
var o, d;

o = { get foo() { return 17; } };
d = Object.getOwnPropertyDescriptor(o, "foo");
// d is { configurable: true, enumerable: true, get: /*访问器函数*/, set: undefined }

o = { bar: 42 };
d = Object.getOwnPropertyDescriptor(o, "bar");
// d is { configurable: true, enumerable: true, value: 42, writable: true }

o = {};
Object.defineProperty(o, "baz", { value: 8675309, writable: false, enumerable: false });
d = Object.getOwnPropertyDescriptor(o, "baz");
// d is { value: 8675309, writable: false, enumerable: false, configurable: false }
```

### 五. 删除

删除就不废话了，delete

```javascript
delete object.property 

delete object['property']
```

总结就是你可以通过getter来给对象设置一个只读属性，再通过设置setter，改变这个只读属性。避免对象属性被污染或者重定义，当然还有很多别的用法，大家自己脑洞

----

参考：

[__defineGetter__](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/__defineGetter__)

[__defineSetter__](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/__defineSetter__)

[__lookupSetter__](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/__lookupSetter__)

[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)

[setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)

[getOwnPropertyDescriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

[delete](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete)

[defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)


