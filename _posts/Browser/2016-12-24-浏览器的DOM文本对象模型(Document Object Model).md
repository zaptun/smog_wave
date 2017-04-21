---
layout: post
filename: 2016-12-24-浏览器的DOM文本对象模型(Document Object Model)
title: 浏览器的DOM文本对象模型(Document Object Model)
date: 2016-12-24 12:59:01 +0800
categories: Browser
tags: Browser
---

解析器的输出“解析树”是由 DOM 元素和属性节点构成的树结构。现代浏览器大都基于XML中的DOM规范来建立，而且DOM规范提供了对ECMAScript的绑定，可以方便的用来实现javascript。

DOM 是文档对象模型 (Document Object Model) 的缩写。它是 HTML 文档的对象表示，同时也是外部内容（例如 JavaScript）与 HTML 元素之间的接口。 

解析树的根节点是“Document”对象。

DOM 与标记之间几乎是一一对应的关系。比如下面这段标记：

```html
<html>
  <body>
    <p>
      Hello World
    </p>
    <div> <img src="example.png"/></div>
  </body>
</html>

```

可翻译成如下的 DOM 树：

![image](../images/post/browser18.png)

和 HTML 一样，DOM 也是由 W3C 组织指定的。请参见 www.w3.org/DOM/DOMTR。这是关于文档操作的通用规范。其中一个特定模块描述针对 HTML 的元素。HTML 的定义可以在这里找到：[http://www.w3.org/TR/2003/REC-DOM-Level-2-HTML-20030109/idl-definitions.html](http://www.w3.org/TR/2003/REC-DOM-Level-2-HTML-20030109/idl-definitions.html)。

我所说的树包含 DOM 节点，指的是树是由实现了某个 DOM 接口的元素构成的。浏览器所用的具体实现也会具有一些其他属性，供浏览器在内部使用。

下面这副图是WinRiver公司采用Java开发的ICEStorm的RenderEngine的框架图，这个模型基本上也是所有现代浏览器通用的一个模型了。我们在Konqueror中同样可以看到类似的构造：

```html
                                    JS Engine
                                       |
                               ECMAScript Binding
                                       |
Stream->Tokenizer/Parser->DOM Builder->DOM->Layout Engine->Rendering out
                        |                  |
               HTML Validator             CSS
                                           |
                                       CSS Parser 

```

DOM是浏览器的核心，DOM（Document Object Model）规范定义了一个XML文档的文档结构模型，它是一套语言无关的接口，由IDL定义。通过DOM API你可以遍历、修改文档。

DOM分为DOM Core和DOM HTML，DOM Core是DOM的核心部分，它定义了一系列最基本的接口，利用这些接口程序可以访问和维护已经解析过的XML和HTML文档。DOM HTML定义了HTML的高级接口，并和DOM Core中的有继承关系。

总之，通过DOM我们可以把一个HTML文档组织起来，并通过DOM API对文档进行操作。DOM在逻辑上是一种树状的结构，可以通过任何一种数据机构予以实现。

一个示例DOM树：

```html
Dom:
                      Document
                         |
                        HTML
                        /  \
                    Head   body
                      |      |
                   title textNode("hello")
                      |
               textNode("hello") 
 
（Document是这个树的根结点）
```

而这棵DOM树需要进行分词和解析网络上读取的HTML字符数据流。

而且DOM提供了和ECAMScript的绑定，就是提供了ECMAScript要求的Host。

ECMAScript是一个工业标准，Netscape的javascript和MS的JScript都符合这个标准，实际上这个标准就是从它们那里来的。我们在HTML文本中定义的javascript，需要解释执行，这些工作由JSEngine来完成。比如我们执行window.alert(“hello!”)，window这个不是ECMAScript内建的，你需要实现这样一个Host，把它的属性和方法告诉给JSEngine，它在解释执行时就会自动调用你实现中的相应的方法。ECMAScript相关的概念有很多，你可以去看看它的规范。JSEngine可以看看Mozilla.org/js中的部分。

DOM树最后需要显示在你的屏幕上，这时候你需要通过一个Layout算法进行排版输出。CSS规定了一些输出的特性，包括颜色字体等等。CSS需要独立的Parser来进行解析。CSS是DOM规范中的一部分。

对于浏览器的开发者来说，你要实现DOM API、DOM ECMAScript Binding、JSEngine、LayoutEngine，当然有的部分你可以使用已有的成果。