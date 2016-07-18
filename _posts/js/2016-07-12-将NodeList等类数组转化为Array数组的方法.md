---
layout: post
filename: 2016-07-12-将NodeList等类数组转化为Array数组的方法
title: 将NodeList等类数组转化为Array数组的方法
date: 2016-07-12 17:47:40 +0800
categories: Js
tags: Js 类数组
---

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
```