---
layout: post
filename: 2016-07-12-将NodeList等类数组转化为Array数组的方法
title: 将NodeList等类数组转化为Array数组的方法
date: 2016-07-12 17:47:40 +0800
categories: Js
tags: Js 类数组转数组
---

### 1.什么是类数组Array-like?

我们举一个比较经典的类数组（最经典的类数组是Arguments，这里暂且不说）。

var nodeList=document.querySelectorAll("div");这个nodeList就是一个类数组。何以见得？它可
以用nodeList[0]取到第一个子元素。但是当我们用console.log(nodeList instanceof Array)返回false也就是说它并不是数组的实例，也就不是数组。<br>

ArrayLike对象的精妙在于它和javascript原生的Array类似，但是它是自由构建的，它来自开发者对javascript对象的扩展，也就是说：对于它的原型（prototype）我们可以自由定义，而不会污染到javascript原生的Array。

### 2.类数组转换为数组之后进行操作有什么优势？

1.首先考虑性能方面的优势，我做了个实验。请戳   性能比较：点击按钮进行遍历

实验结论：直接用for循环遍历和数组转换为类数组之后进行遍历，优势并不明显。反而感觉有劣势，但影响不大。

2.其次，既然性能没有增强，为什么要实现类数组转换为数组？

简而言之：便捷。Array在js里面是非常强大有用的，它有很多方法：shift,unshift,splice,slice,concat,reverse,sort。ECMAscript 2015又新增了一些方法forEach,isArray,indexOf,lastIndexOf,every,some,map,filter,reduce等等。包括那个IT笑话，“对程序员来说push的反义词是pop（^_^）”  说的都是和数组相关的。但是这些强大的方法，类数组是不一定全部支持的。当我们需要进行数组属性操作的时候才发现，啊原来这是个类数组，啊，要是能变成数组多好啊，否则我还得自己写。虽然每一种方法都是可以自己靠基础api实现的，但是每次都做重复的基础工作，多枯燥。学会偷懒有时候能帮助提高效率~~

### 转换方式

核心：

```javascript
[].slice.call(arrayLike).forEach(function(element,index){ //可以随意操作每一个element了 
})
```

解析1：Array.prototype.slice表示数组的原型中的slice方法。注意这个slice方法返回的是一个Array类型的对象(这句话很多分析的文章没有点破，我就问了凭什么非得是slice啊?原因就在这)。splice行不行呢？Array.prototype.splice.call(arrayLike,0)这种形式也可以。只要返回的是原数组就可以。当然，那种写法更省事一目了然。

解析2：能调用call的只有方法，所以不能用[].call这种形式，得用[].slice。而call的第一个参数表示真正调用slice的环境变为了arrayLike对象。所以就好像arrayLike也具有了数组的方法。

---

#### 自定义转换方法：

```javascript
function changeToArray(obj){
    var result = null; //数组 
    try {
        result = [].prototype.slice.call(obj);
    } catch (e) { //兼容ie 
        result = new Array();
        for (var i = 0; i < obj.length; i++) {
            result.push(obj[i]);
        }
    }
    return result
}

var realArray = (obj.length === 1 ? [obj[0]] : Array.apply(null, obj));
```

#### 总结下都有哪几种方式

```javascript
//obj is a Array-like 

//ES5
var realArray = Array.prototype.slice.call(obj);
var realArray = Array.apply(null, obj);
var realArray = [].slice.call(obj);

//ES6
// Array.from()
var realArray = Array.from(obj);
// 散布操作符（spread operator ）
var realArray = [...obj];
```

