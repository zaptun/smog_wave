---
layout: post
filename: 2016-12-24-DTD-DOCTYPE与浏览器解析渲染的背景知识
title: DTD-DOCTYPE与浏览器解析渲染的背景知识
date: 2016-12-24 12:26:01 +0800
categories: Browser
tags: Browser
---

## HTML DTD

HTML 的定义采用了 DTD 格式。此格式可用于定义 SGML 族的语言。它包括所有允许使用的元素及其属性和层次结构的定义。如上文所述，HTML DTD 无法构成与上下文无关的语法。

DTD 存在一些变体。严格模式完全遵守 HTML 规范，而其他模式可支持以前的浏览器所使用的标记。这样做的目的是确保向下兼容一些早期版本的内容。最新的严格模式 DTD 可以在这里找到：[http://www.w3.org/TR/html4/strict.dtd](http://www.w3.org/TR/html4/strict.dtd)

## DOCTYPE的诞生 - 怪异模式&严格模式

DOCTYPE，或者称为 Document Type Declaration（文档类型声明，缩写 DTD）。通常情况下，DOCTYPE 位于一个 HTML 文档的最前面的位置，位于根元素 HTML 的起始标签之前。因为浏览器必须在解析 HTML 文档正文之前就确定当前文档的类型，以决定其需要采用的渲染模式，不同的渲染模式会影响到浏览器对于 CSS 代码甚至 JavaScript 脚本的解析。尤其是在 IE 系列浏览器中，由 DOCTYPE 所决定的 HTML 页面的渲染模式至关重要。

首先看看当一个 HTML 文档在没有 DOCTYPE 时，页面在各浏览器中会如何渲染及解析。我们尝试生成一个在最顶端没有 DOCTYPE 的 HTML 文档：

```html
<html>
<head></head>
<body>
<script>
document.write(document.compatMode);
</script>
</body>
</html>
```

这个页面在所有的浏览器中均返回一致的结果，页面上打印出了“BackCompat”。 document.compatMode 属性最初由微软在 IE 中创造出来，这是一个只读的属性，返回一个字符串，只可能存在两种返回值：

* **BackCompat**：标准兼容模式（Standards-compliant mode）未开启；
* **CSS1Compat**：标准兼容模式已开启。

其实这里所谓的<br>
标准兼容模式未开启即“混杂模式”（又叫怪异模式，Quirks mode）<br>
标准兼容模式已开启即“标准模式”（又叫严格模式，Standards mode 或者 Strict mode）。 <br>
所以前面那个测试样例中，没有书写 DOCTYPE 的 HTML 文档在所有浏览器中均会以混杂模式进行渲染和解析。

究竟为何浏览器要制作这么一个“开关”？微软开发的 IE 系列浏览器中寿命最长的 IE6 伴随 Windows XP 诞生。相比上一个版本 IE5.5，IE6 确实有着许多重大的改进，其中对于页面渲染而言最大的变化就在于 IE6 支持了部分 CSS1 中的特性。例如，为一个块级元素设定宽度及高度时，不再作用于 border 外围，而是如 W3C 规范中所描述的仅仅是元素内容之上。这一点和 IE5.5 差别巨大。为了保证那些 90 年代后期的基于 IE6 之前版本开发的页面能够正常显示，即保证浏览器有向后兼容性，此“开关”诞生，微软试图通过对 DOCTYPE 的判断来决定浏览器采取何种模式工作，即是 IE6 还是 IE5.5 的问题。所以从 document.compatMode 返回的字符串值中也可以看出来，BackCompat 代表了向后兼容（即 IE5.5），CSS1Compat 代表了对 CSS1 规范的兼容（即 IE6）。由此，浏览器的工作模式被分为了混杂模式及标准模式。

值得注意的是，IE 的版本号一路从 6.0 升至了目前的 9.0，但升级仅限于标准模式。对于混杂模式，IE 的版本号永久的冻结在 5.5，这也算是为了向后兼容的巨大牺牲。也就是说即使我们使用着最新最高级的 IE9，但若我们不书写 DOCTYPE 或者使用了能够触发混杂模式的 DOCTYPE，那我们所面对的浏览器仍相当于是那个十几年前的老古董 IE5.5。而其他那些浏览器的混杂模式和标准模式之间却没有想 IE 中这么大的差别。

## 近似标准模式

近似标准模式（Almost Standards Mode）从字面意思上看与标准模式非常类似，但确实有小的差别。主要体现在对于表格单元格内垂直方向布局渲染差异。IE8 开始、Firefox、Chrome、Safari、Opera 7.5 开始，这些浏览器的标准模式更加严格的遵循了 CSS2.1 规范，故对于在目前看来不太“标准”的以前的标准模式，被赋予了“近似标准模式”的名字。但是在较早的 IE6 IE7 以及 Opera 7.5 之前版本中，浏览器无法严格遵循 CSS2.1 规范，故对于它们来说没有这个近似标准模式，也可以理解为它们的近似标准模式就是标准模式。

到目前为止，可以看到各浏览器主要包含了三种模式。在 HTML5 草案中，更加明确的规定了模式的定义：

|传统名称|HTML5 草案名称|document.compatMode 返回值|
|:----:|:----:|:----:|
|standards mode 或者 strict mode|no-quirks mode|CSS1Compat |
|almost standards mode|limited-quirks mode|CSS1Compat |
|quirks mode | quirks mode | BackCompat |

## DOCTYPE 的选择

### 1. 工作模式简介

浏览器的工作模式常被称为“渲染模式”。实际上浏览器不同的工作模式不仅对渲染有影响，对代码的解析以及脚本的行为也同样有影响。

从更广泛的角度来看，浏览器的工作模式的差异不仅体现在处理 HTML 页面的时候，处理 XML 及一些非 WEB 内容时也有模式上的差异，但本文仅讨论浏览器在处理 HTML 页面时工作模式。

### 2. 工作模式的来源及变迁

不使用 DOCTYPE 一定会使 HTML 文档处于混杂模式，然而使用了 DOCTYPE，也不一定就能够使文档在所有浏览器中均处于标准模式。DOCTYPE 本身不就是一个“开关”吗？为何在有 DOCTYPE 的 HTML 文档之上仍然还会出现混杂模式？这个和以下条件有关：

* 使用了本身就会使浏览器进入混杂模式的古老的甚至是错误的 DOCTYPE；
* 在 DOCTYPE 之前出现了其他内容，如注释，甚至是 HTML 标签。

我们先说第一个条件。HTML 历史悠久，仅正确的 HTML 类型的 DOCTYPE 就有很多种。先看一个标准的 DOCTYPE：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

上面的 DOCTYPE 包含 6 部分：

1. 字符串“<!DOCTYPE”
2. 根元素通用标识符“HTML”
3. 字符串“PUBLIC”
4. 被引号括起来的公共标识符（publicId）“-//W3C//DTD HTML 4.01//EN”
5. 被引号括起来的系统标识符（systemId）“http://www.w3.org/TR/html4/strict.dtd”
6. 字符串“>”

其中根元素通用标识符、公共标识符、系统标识符均可以通过脚本调用 DOM 接口获得，分别对应 document.doctype.name、document.doctype.publicId、document.doctype.systemId（IE6 IE7 不支持）。

不同的 DOCTYPE 之间，上面三部分可能不尽相同，有些 DOCTYPE 确实其中某部分，如何在这些纷繁的 DOCTYPE 中选择？

其实浏览器在嗅探 DOCTYPE 时只考虑了上述 6 部分中的第 1、2、4、6 部分，且不区分大小写。在各浏览器内核实现中，几乎都存在一个名单用于记录这些常见的 DOCTYPE 所对应的模式，例如 WebKit 内核中 DocTypeStrings.gperf 文件。各浏览器名单列表中触发模式的不同导致了某些 DOCTYPE 出现在不同浏览器中触发了不同模式的现象，如 。而对于名单之外的 DOCTYPE，浏览器之间处理的差异也会导致触发不同的模式，比如可能有的浏览器会将名单之外的 DOCTYPE 当作混杂模式，而有的却会一律当作标准模式。

所以我们在选用 DOCTYPE 的时候首先确定的是我们想让 HTML 文档使用标准模式。

* 如果力求最简，则 HTML5 的 DOCTYPE 是最佳选择：

```html
<!DOCTYPE html>
```

>所有的主流浏览器均将这种只包含第 1、2、6 部分的最短的 DOCTYPE 视为标准模式。

* 如果力求稳妥，则较早的 HTML4.01 Strict 的 DOCTYPE 也是一种好的选择：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

>它在各主流浏览器中触发的模式与上面的 HTML5 的完全一致。

* 有时候我们处于特殊情况也希望浏览器能够都处于近似标准模式，则可选择：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">。
```

## DOCTYPE 之前不能出现的内容

前面提到，DOCTYPE 作为一个决定浏览器对于 HTML 文档采取何种模式“开关”，应出现在 HTML 文档的最前面。但有时候处于某些原因，有的作者会在 DOCTYPE 之前防止一些内容，可能是服务端输出的某些信息。这样会让浏览器感到极为“困惑”，它第一眼看到的不是 DOCTYPE，故可能会认为页面没有 DOCTYPE，则可能触发了混杂模式。然而事实上在这一点各浏览器的处理并不相同。我们将 DOCTYPE 之前可能出现的这些内容分类，它们包括：

1. 普通文本
2. HTML 标签
3. HTML 注释
4. XML 声明
5. IE 条件注释

对于普通文本和 HTML 标签，各浏览器均进入了混杂模式，这个很好理解，都看到疑似的 HTML 文档正文了，浏览器不太会往下追查 DOCTYPE 在哪里。

对于 HTML 注释和 XML 声明，它们和上面的普通文本和 HTML 标签有些差别，它们不会在页面中展示出来，即不可视。这时，有的浏览器则显得十分“智能”，非 IE 浏览器均会忽略它们的存在，DOCTYPE 被正确解析。但是在 IE6 中，DOCTYPE 之前的 XML 声明会导致页面进入混杂模式，而所有的 IE 均会使 DOCTYPE 之前出现了 HTML 注释的页面进入混杂模式。在 IE9 中当出现这种情况时，浏览器在控制台中给出了提示：“HTML1113: 文档模式从 IE9 标准 重新启动到 Quirks ”，看来微软在这一点上不打算“随大流”，这样做也可以敦促作者尽量避免在 DOCTYPE 之前加入其他内容。

有的作者很聪明，他既在 DOCTYPE 之前加入了他需要的内容，却又没有使 IE 由于这些内容而进入混杂模式。他可能会这么写：

```html
<![if !IE]><!-- some comments --><![endif]>
<![if false]><!-- some comments --><![endif]>
```

又或者是

```html
<li><!--[if !IE]>some text<![endif]-->
```

上面这些 IE 条件注释在非 IE 浏览器中，可能完全被忽略，可能被解释为普通 HTML 注释。但是在 IE 中它们全部消失了，因为这就是 IE 条件注释的作用。所以这也是目前比较合适的在 DOCTYPE 之前写点什么又保证所有浏览器均为标准模式的做法，但我们仍然不推荐在 DOCTYPE 之前加入任何非空白内容。

## <!DOCTYPE>的定义

<!DOCTYPE>声明位于文档中的最前面的位置，处于<html>标签之前。此标签可告知浏览器文档使用哪种HTML或XHTML规范。该标签可声明三种DTD类型，分别表示严格版本、过渡版本以及基于框架的HTML版本。（假如文档中的标记不遵循doctype声明所指定的DTD，这个文档除了不能通过代码校验之外，还有可能无法在浏览器中正确显示。）

## <!DOCTYPE>的用法

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

解析：在上面的声明中，声明了文档的根元素是 html，它在公共标识符被定义为 "-//W3C//DTD XHTML 1.0 Strict//EN" 的 DTD 中进行了定义。浏览器将明白如何寻找匹配此公共标识符的 DTD。如果找不到，浏览器将使用公共标识符后面的 URL 作为寻找 DTD 的位置。

* - : 表示组织名称未注册。Internet 工程任务组(IETF)和万维网协会(W3C)并非注册的 ISO 组织。
* + : 为默认，表示组织名称已注册。
* DTD : 指定公开文本类，即所引用的对象类型。 默认为DTD。
* HTML : 指定公开文本描述，即对所引用的公开文本的唯一描述性名称。后面可附带版本号。默认为HTML。
* URL ： 指定所引用对象的位置。
* Strict ： 排除所有 W3C 专家希望逐步淘汰的代表性属性和元素。

## 三种HTML文档类型

HTML 4.01 规定了三种文档类型：Strict、Transitional 以及 Frameset。

用**HTML Strict DTD**类型，如果需要干净的标记，免于表现层的混乱：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
```

**Transitional DTD** 可包含 W3C 所期望移入样式表的呈现属性和元素. 如果用户使用了不支持层叠样式表（CSS）的浏览器以至于你不得不使用 HTML 的呈现特性时，用 Transitional DTD 类型：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" " http://www.w3.org/TR/html4/loose.dtd">
```

**Frameset DTD** 被用于带有框架的文档。除 frameset 元素取代了 body 元素之外，Frameset DTD 等同于 Transitional DTD：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" " http://www.w3.org/TR/html4/frameset.dtd">
```


## 三种 XML 文档类型

XHTML 1.0 规定了三种 XML 文档类型：Strict、Transitional 以及 Frameset

**XHTML Strict DTD** 如果需要干净的标记，免于表现层的混乱，用XHTML Strict DTD类型：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```
**Transitional DTD** 可包含 W3C 所期望移入样式表的呈现属性和元素. 如果用户使用了不支持层叠样式表（CSS）的浏览器以至于你不得不使用 HTML 的呈现特性时，用 Transitional DTD 类型：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

**Frameset DTD** 被用于带有框架的文档。除 frameset 元素取代了 body 元素之外，Frameset DTD 等同于 Transitional DTD：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

## 选择正确的doctype

为了获得正确的doctype声明，关键就是让dtd与文档所遵循的标准对应。例如，假定文档遵循的是xhtml 1.0 strict标准，文档的doctype声明就应该引用相应的dtd。

另一方面，如果doctype声明指定的是xhtml dtd，但文档包含的是旧式风格的html标记，就是不恰当的；类似地，如果doctype声明指定的是html dtd，但文档包含的是xhtml 1.0 strict标记，同样是不恰当的。

如果没有指定有效的doctype声明，大多数浏览器都会使用一个内建的默认dtd。在这种情况下， 浏览器会用内建的dtd来试着显示你所指定的标记(不过这是页面写得太糟糕的时候的做法)。

看了一下京东、淘宝、还有博客园，用的都是这个（本人也一直都是用的这个）：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

但是发现百度跟谷歌用的是`<!doctype html>`，就再仔细查了一下资料，发现HTML5也是直接用的这个，不过是因为 HTML 5 不基于 SGML，因此不需要对 DTD 进行引用，但是需要 doctype 来规范浏览器的行为（让浏览器按照它们应该的方式来运行）。

建议在以后都直接用`<!doctype html>`，用<!doctype html>的话就会开启浏览器的标准兼容模式，在标准兼容模式下，不能保证与其它版本（IE6之前的，直接忽略吧），的 Internet Explorer 保持兼容，文档的渲染行为也许与将来的 Internet Explorer 不同，但也请大家放心地使用吧~~

>PS：**XHTML 1就是HTML 4.01的XML化**，是一种不向前兼容的格式。HTML 4.01 中的 doctype 需要对 DTD 进行引用，因为 HTML 4.01 基于 SGML。SGML规定了在文档中嵌入描述标记的标准格式，指定了描述文档结构的标准方法，目前在WEB上使用的HTML格式便是使用固定标签集的一种 SGML文档。


### 建议

通过上面的历史回顾以及分析，我们看到了 DOCTYPE 对于目前主流浏览器的关键作用，同时也发掘了能够触发各浏览器标准模式的最佳 DOCTYPE。标准模式会使不同浏览器之间发生兼容性问题的风险降至最低，选择正确的 DOCTYPE 以及保证 DOCTYPE 在 HTML 文档中绝对开头的位置则是使 DOCTYPE 发挥其正确作用的关键。

