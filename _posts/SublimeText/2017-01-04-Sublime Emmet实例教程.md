---
layout: post
filename: 2017-01-04-Sublime Emmet实例教程
title: Sublime Emmet实例教程
date: 2017-01-04 17:40:34 +0800
categories: Sublime
tags: Sublime Emmet
---

## 何为Emmet

简言之,Emmet的前身是大名鼎鼎的Zen coding;

### 功能

snippet(代码片段,不如用专门的片段插件)
abbreviation expand(简写展开)

### 目的

只有一个,加快web开发(编码速度)

## Emmet基础

### 知识预备

HTML/CSS标签熟悉掌握 — 知道是干什么的做什么的知道选择器的关系,比如兄弟,子代,后代等解析简写代码可以用Tab键或者Ctrl+E来调用

### Emmet特性

* 简写支持嵌套
* 简写支持分组
* 简写支持乘法
* 简写支持自增和自减,起序,编号

### Emmet语法

#### HTML

**文档初始化**

html:5 或!：用于HTML5文档类型 —看代码 

html:xt：用于XHTML过渡文档类型 — 不演示 

html:4s：用于HTML4严格文档类型 — 不演示

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>

</body>
</html>
```

**id#|类.|属性[]|内容{},若是不带父元素,则默认为隐性生成(就近原则)**

```html
<!-- 简写格式我就放在注释里面啦啦!! -->
<!--#test.test-->
<div id="test" class="test">

</div>

<!-- p#test.test  -->
<p id="test" class="test"></p>

<!-- a[href="http://www.baidu.com"]{文本内容 我是百度} -->
  <a href="http://www.baidu.com">文本内容--我是百度</a>
```

**后代> | 兄弟+ | 上级^**

```html
<!-- div>ul>li 后代 -->
<div>
  <ul>
    <li></li>
  </ul>
</div>

<!-- div>p+p  兄弟-->
<div>
  <p></p>
  <p></p>
</div>

<!-- div>p>ul>li>^span+b  上级-->
<div>
  <p>
    <ul>
      <li></li>
      <span></span>
      <b></b>
    </ul>
  </p>
</div>
```

**分组()/乘法*/自增$/自减$@-/起序$@数字**

```html
<!-- div>ul>(li>a)*2 -->
<div>
  <ul>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
  </ul>
</div>

<!-- div>ul>(li>a{文本$$})*2 -->
<!--$是匹配数字,一个代表1开始,两个01开始,依次001-->
<div>
  <ul>
    <li><a href="">文本01</a></li>
    <li><a href="">文本02</a></li>
  </ul>
</div>

<!-- div>ul>(li>a{文本$@-})*3 -->
<!-- @-代表启用自减,降序排列   -->
<div>
  <ul>
    <li><a href="">文本3</a></li>
    <li><a href="">文本2</a></li>
    <li><a href="">文本1</a></li>
  </ul>
</div>

<!-- div>ul>(li>a{文本$@2})*5 -->
<!-- $@number 代表几号开始出现数字  -->
<div>
  <ul>
    <li><a href="">文本2</a></li>
    <li><a href="">文本3</a></li>
    <li><a href="">文本4</a></li>
    <li><a href="">文本5</a></li>
    <li><a href="">文本6</a></li>
  </ul>
</div>
```

## 综合运用-静态布局

### Emmet简写

```html
(#header>.nav>ul>(li>a{首页/美女/关于/……})*5)+(#Container>(#(.left_sidebar>.category>ul>(li>a[herf=”#” title=”这是测试链接啊”]{我是侧边栏链接$$$})*5)+(#right_content>ul>li>a[href=”#”]>(img[alt=”哟吼吼吼” src=” “])+span{这是用来描述图片用的}*12)))+#footer>ul>(li>a{关于/联系我们/…..})*4
```

>只是简单的排版下.添加了下背景颜色

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>这是一个测试DEMO</title>
  <style>
    *{margin:0;padding:0}
    ul{list-style: none}
    #header{height:300px;width:100%;background: #5ecc17;border:2px solid #000;}
    #container{margin:0 auto;height:500px;width:800px;background: #e97726;border:1px solid #000;}
    #footer{height:200px;width:100%;background: #000;border:1px solid #000;}
    .left_sidebar{float:left;background: #02c4bc;height:500px;border:1px solid #000;}
    .right_content{float:right;background: #113a0d;height:500px;border:1px solid #000;}
  </style>
</head>
<body>
        <div id="header">
        <div class="nav">
          <ul>
            <li><a href="">首页/美女/关于/......</a></li>
            <li><a href="">首页/美女/关于/......</a></li>
            <li><a href="">首页/美女/关于/......</a></li>
            <li><a href="">首页/美女/关于/......</a></li>
            <li><a href="">首页/美女/关于/......</a></li>
          </ul>
        </div>
      </div>
      <div id="container">
        <div id="">
          <div class="left_sidebar">
            <div class="category">
              <ul>
                <li><a href="" herf="#" title="这是测试链接啊">我是侧边栏链接001</a></li>
                <li><a href="" herf="#" title="这是测试链接啊">我是侧边栏链接002</a></li>
                <li><a href="" herf="#" title="这是测试链接啊">我是侧边栏链接003</a></li>
                <li><a href="" herf="#" title="这是测试链接啊">我是侧边栏链接004</a></li>
                <li><a href="" herf="#" title="这是测试链接啊">我是侧边栏链接005</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div id="right_content">
          <ul>
            <li><a href="#">
                <img src=" " alt="哟吼吼吼">
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
                <span>这是用来描述图片用的</span>
              </a></li>
          </ul>
        </div>
      </div>
      <div id="footer">
        <ul>
          <li><a href="">关于/联系我们/.....</a></li>
          <li><a href="">关于/联系我们/.....</a></li>
          <li><a href="">关于/联系我们/.....</a></li>
          <li><a href="">关于/联系我们/.....</a></li>
        </ul>
      </div>
</body>
</html>

```