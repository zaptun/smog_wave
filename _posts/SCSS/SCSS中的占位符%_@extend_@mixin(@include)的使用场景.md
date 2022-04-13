---
layout: post
filename: 2022-02-05-SCSS中的占位符%_@extend_@mixin(@include)的使用场景
title: SCSS中的占位符%_@extend_@mixin(@include)的使用场景
date: 2022-02-05 03:37:37 +0800
categories: scss
tags: scss
---





转载请注明出处——https://blog.csdn.net/chy555chy

[SASS在线编译网站](https://www.sassmeister.com/)

### 占位符%

被声明为占位符的CSS类，不会出现在最终生成的CSS中

* SASS代码

```scss
%log {
  display: block;
  color: black;
}

.log-debug {
  @extend %log;
  border: 1px solid blue;
}

.log-error {
  @extend %log;
  border: 3px dotted red;
}
```

* 编译后的CSS代码
```css
.log-error, .log-debug {
  display: block;
  color: black;
}

.log-debug {
  border: 1px solid blue;
}

.log-error {
  border: 3px dotted red;
}
```

### @extend

基础类有在最终的CSS中被使用到的情况，使用该标识

* SASS代码
```scss
.log {
  display: block;
  color: black;
}

.log-debug {
  @extend .log;
  border: 1px solid blue;
}

.log-error {
  @extend .log;
  border: 3px dotted red;
}
```

* 编译后的CSS代码
```css
.log, .log-error, .log-debug {
  display: block;
  color: black;
}

.log-debug {
  border: 1px solid blue;
}

.log-error {
  border: 3px dotted red;
}
```

### @mixin（@include）

@mixin 是直接将代码复制到其他类里面，这样会导致生成的CSS过大，所以如果能用@extend，尽量使用@extend

* SASS代码
```scss
@mixin log($color: black) {
  display: block;
  color: $color;
}
.log-debug {
  @include log;
  border: 1px solid green;
}
.log-warn {
  @include log(yellow);
  border: 1px solid yellow;
}

.log-error {
  @include log(red);
  border: 3px dotted red;
}
```

* 编译后的CSS代码
```css
.log-debug {
  display: block;
  color: black;
  border: 1px solid green;
}

.log-warn {
  display: block;
  color: yellow;
  border: 1px solid yellow;
}

.log-error {
  display: block;
  color: red;
  border: 3px dotted red;
}
```

>总结
>如果基础类在最终的CSS中有用到，则尽量用 @extend；否则使用占位符%
>基础类需要传参，那么就只能使用 @mixin（@include）

