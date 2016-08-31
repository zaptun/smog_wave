---
layout: post
filename: 2016-08-05-Js中的callee和caller
title: Js中的callee和caller
date: 2016-08-05 16:30:53 +0800
categories: Js
tags: callee和caller
---

## callee

callee 属性的初始值就是正被执行的 Function 对象。

callee 属性是 arguments 对象的一个成员，它表示对函数对象本身的引用，这有利于匿名
函数的递归或者保证函数的封装性，例如下边示例的递归计算1到n的自然数之和。而该属性
仅当相关函数正在执行时才可用。还有需要注意的是callee拥有length属性，这个属性有时候
用于验证还是比较好的。arguments.length是实参长度，arguments.callee.length是
形参长度，由此可以判断调用时形参长度是否和实参长度一致。

示例

比较一般的递归函数：调用时：alert(sum(100));
其中函数内部包含了对sum自身的引用，函数名仅仅是一个变量名，在函数内部调用sum即相当于调用
一个全局变量，不能很好的体现出是调用自身，这时使用callee会是一个比较好的方法。

```javascript

//callee可以打印其本身
function calleeDemo() {
     alert(arguments.callee);
}
//用于验证参数
function calleeLengthDemo(arg1, arg2) {
    if (arguments.length==arguments.callee.length) {
         window.alert("验证形参和实参长度正确！");
        return;
     } else {
         alert("实参长度：" +arguments.length);
         alert("形参长度： " +arguments.callee.length);
     }
}
```

#### 递归计算中的使用：

递归函数是在一个函数通过调用自身的情况下去解决的：

//方式如下：

```javascript
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}
```

但是这在js里面可能会出现错误：
var anotherFactorial = factorial;
factorial = null;
alert(anoterFactorial(4));
因为在调用anoterFactorial时内部的factorial已经不存在了。
解决方法是通过arguments.callee来解决。
如下：

```javascript
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num - 1);
    }
    var anotherFactorial = factorial;
    factorial = null;
    alert(anotherFactorial(4));
    //成功
}
```


## caller

返回一个对函数的引用，该函数调用了当前函数。

functionName.caller

functionName 对象是所执行函数的名称。

说明：对于函数来说，caller 属性只有在函数执行时才有定义。 如果函数是由 Javascript 程序的顶层调用的，那么 caller 包含的就是 null 。

下面的例子说明了 caller 属性的用法：

```javascript
function callerDemo() {
    if (arguments.caller) {
        var a = callerDemo.caller.toString();
        alert(a);
    } else {
        alert("this is a top function");
    }
}

function handleCaller() {
    callerDemo();
}
handleCaller();

function calleeDemo() {
    alert(arguments.callee);
}
calleeDemo();
```

