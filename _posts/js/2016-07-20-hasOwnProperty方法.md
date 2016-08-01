---
layout: post
filename: 2016-07-20-hasOwnProperty方法
title: hasOwnProperty方法
date: 2016-07-20 16:24:36 +0800
categories: Js
tags: hasOwnProperty
---

### hasOwnProperty() 方法用来判断某个对象是否含有指定的自身属性。

|-|-|
语法 | obj.hasOwnProperty(prop)
参数 | prop 要检测的属性名称。
描述 | 所有继承了 Object.prototype 的对象都会从原型链上继承到 hasOwnProperty 方法，这个方法可以用来检测一个对象是否含有特定的自身属性，和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。

#### 1.使用 hasOwnProperty 方法判断某对象是否含有特定的自身属性

下面的例子检测了对象 o 是否含有自身属性 prop：

```javascript
o = new Object();
o.prop = 'exists';

function changeO() {
    o.newprop = o.prop;
    delete o.prop;
}
o.hasOwnProperty('prop');
// 返回 true
changeO();
o.hasOwnProperty('prop');
// 返回 false
```

#### 2.自身属性和继承属性的区别

下面的例子演示了 hasOwnProperty 方法对待自身属性和继承属性的区别：

```javascript
o = new Object();
o.prop = 'exists';
o.hasOwnProperty('prop');
// 返回 true
o.hasOwnProperty('toString');
// 返回 false
o.hasOwnProperty('hasOwnProperty');
// 返回 false
```

#### 3.遍历一个对象的所有自身属性

下面的例子演示了如何在遍历一个对象的所有属性时忽略掉继承属性，注意这里 for..in 循环只会遍历可枚举属性，这通常就是我们想要的，直接使用 **Object.getOwnPropertyNames()** 方法也可以实现类似的需求

```javascript
var buz = {
    fog: 'stack'
};
for (var name in buz) {
    if (buz.hasOwnProperty(name)) {
        alert("this is fog (" + name + ") for sure. Value: " + buz[name]);
    } else {
        alert(name);
        // toString or something else
    }
}
```

#### 4.hasOwnProperty 方法有可能被遮蔽

如果一个对象拥有自己的 hasOwnProperty 方法, 则原型链上的同名方法会被遮蔽（shadowed）：

```javascript
var foo = {
    hasOwnProperty: function() {
        return false;
    },
    bar: 'Here be dragons'
};
foo.hasOwnProperty('bar');
// 始终返回 false
// 如果担心这种情况，可以直接使用原型链上真正的 hasOwnProperty 方法
({}).hasOwnProperty.call(foo, 'bar');
// true
Object.prototype.hasOwnProperty.call(foo, 'bar');
// true
```

### 参考：
[Object.prototype.hasOwnProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)