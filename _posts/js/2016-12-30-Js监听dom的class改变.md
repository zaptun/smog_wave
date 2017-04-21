---
layout: post
filename: 2016-12-30-Js监听dom的class改变
title: Js监听dom的class改变
date: 2016-12-30 17:34:52 +0800
categories: Js
tags: Js 监听dom的class改变
---

DOM修改监听

怎么监听一个dom的class改变

DOM mutation events

DOMAttributeNameChanged
DOMAttrModified
DOMCharacterDataModified
DOMContentLoaded
DOMElementNameChanged
DOMNodeInserted
DOMNodeInsertedIntoDocument
DOMNodeRemoved
DOMNodeRemovedFromDocument
DOMSubtreeModified


MutationObserver

https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

// Firefox和Chrome早期版本中带有前缀
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

// 选择目标节点
var target = document.querySelector('#some-id');
 
// 创建观察者对象
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    console.log(mutation.type);
  });    
});
 
// 配置观察选项:
var config = { attributes: true, childList: true, characterData: true }
 
// 传入目标节点和观察选项
observer.observe(target, config);
 
// 随后,你还可以停止观察
observer.disconnect();




var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
var target = $('body')[0];
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    console.log(mutation.type);
  });    
});
var config = { attributes: true, childList: false, characterData: false }
observer.observe(target, config);