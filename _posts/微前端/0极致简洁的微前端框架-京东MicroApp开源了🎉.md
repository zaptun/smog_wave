![极致简洁的微前端框架-京东MicroApp开源了🎉](https://pic3.zhimg.com/v2-21cc1bf0ff22f54cfe781e0a633b8b73_1440w.jpg?source=172ae18b)

# 极致简洁的微前端框架-京东MicroApp开源了🎉

[![cangdu](https://pic1.zhimg.com/02eb9ca673e63152f28ddb46c5861603_xs.jpg?source=172ae18b)](https://www.zhihu.com/people/cang-du-64)

[cangdu](https://www.zhihu.com/people/cang-du-64)

前端开发

202 人赞同了该文章

## 前言

MicroApp是一款基于类WebComponent进行渲染的微前端框架，不同于目前流行的开源框架，它从组件化的思维实现微前端，旨在降低上手难度、提升工作效率。它是目前市面上接入微前端成本最低的框架，并且提供了JS沙箱、样式隔离、元素隔离、预加载、资源地址补全、插件系统、数据通信等一系列完善的功能。MicroApp与技术栈无关，也不和业务绑定，可以用于任何前端框架和业务。

本篇文章中我们会从业务背景、实现思路介绍MicroApp，也会详细介绍它的使用方式和技术原理。

## 业务背景

随着这些年互联网的飞速发展，很多企业的web应用在持续迭代中功能越来越复杂，参与的人员、团队不断增多，导致项目出现难以维护的问题，这种情况PC端尤其常见，许多研发团队也在找寻一种高效管理复杂应用的方案，于是微前端被提及的越来越频繁。

微前端并不是一项新的技术，而是一种架构理念，它将单一的web应用拆解成多个可以独立开发、独立运行、独立部署的小型应用，并将它们整合为一个应用。

在实际业务中，我们也遇到同样的问题，并且在不同的业务场景下尝试了各种解决方案，如iframe、npm包、微前端框架，并对各种方案的优劣进行了对比。

**iframe**：在所有微前端方案中，iframe是最稳定的、上手难度最低的，但它有一些无法解决的问题，例如性能低、通信复杂、双滚动条、弹窗无法全局覆盖，它的成长性不高，只适合简单的页面渲染。

**npm包**：将子应用封装成npm包，通过组件的方式引入，在性能和兼容性上是最优的方案，但却有一个致命的问题就是版本更新，每次版本发布需要通知接入方同步更新，管理非常困难。

**微前端框架**：流行的微前端框架有single-spa和qiankun，它们将维护成本和功能上达到一种平衡，是目前实现微前端备受推崇的方案。

由于iframe和npm包存在问题理论上无法解决，在最初我们采用qiankun作为解决方案，qiankun是在single-spa基础上进行了封装，提供了js沙箱、样式隔离、预加载等功能，并且与技术栈无关，可以兼容不同的框架。

### 业务诉求

qiankun虽然优秀，但依然无法满足我们的预期。第一个问题是在我们实际使用场景中，每个接入微前端的项目运行已久，且每个项目由不同的人员和团队负责，如何降低对源代码的侵入性，减少代码修改和沟通成本，这是我们非常关心的点，所以我们需要一种比qiankun接入成本更小的方案。第二个问题是在多方应用接入的情况下，沙箱并不能完美规避所有问题，但qiankun处理此类不可预料的问题的能力并不是非常高效。在不停的摸索中，我们找到一种极致简洁的实现思路，它像使用组件一样简单，只修改一点点代码就可以接入微前端，并且还提供插件系统，赋予开发者灵活处理问题的能力。



![img](https://pic2.zhimg.com/80/v2-2cc21c0999959455d6c9f07f27d916c5_720w.jpg)



## 实现思路

微前端分为主应用和子应用，主应用也称为基座应用，是其它应用的容器载体，子应用则是被嵌入方。我们分别从主应用和子应用的角度出发，探寻一种更简洁和有效的接入微前端的方式。

### 关于qinkun和single-spa的思考

在single-spa和qiankun中都是通过监听url change事件，在路由变化时匹配到渲染的子应用并进行渲染。这种基于路由监听渲染是single-spa最早实现的，作为出现最早、最有影响力的微前端框架，single-spa被很多框架和公司借鉴，也导致目前实现的微前端的方式大多是基于路由监听。

同时single-spa要求子应用修改渲染逻辑并暴露出三个方法：bootstrap、mount、unmount，分别对应初始化、渲染和卸载，这也导致子应用需要对入口文件进行修改。这个特点也被qiankun继承下来，并且需要对webpack配置进行一些修改。



![img](https://pic1.zhimg.com/80/v2-5f244f4c8aa56f534ea264d7b54e0e4c_720w.jpg)



基于路由监听的实现方式和对子应用入口文件以及webpack配置的修改是必须的吗？

其实并不是，微前端的核心在于资源加载与渲染，iframe的渲染方式就是一个典型，只要能够实现一种元素隔离的功能并且路由符合要求，子应用理论上不需要修改代码就可以嵌入另外一个页面渲染，我们试图从这个角度中找到不一样的实现思路。

### 微前端的组件化

要想简化微前端的实现步骤，必须摒弃旧的实现思路，探索出不同的道路。

我们借鉴了WebComponent的思想，以此为基础推出另一种更加组件化的实现方式：类WebComponent + HTML Entry。



![img](https://pic4.zhimg.com/80/v2-818fb998956995ebe30e8bd4dc1c7e1b_720w.jpg)



**HTML Entry**：是指设置html作为资源入口，通过加载远程html，解析其DOM结构从而获取js、css等静态资源来实现微前端的渲染，这也是qiankun目前采用的渲染方案。

**WebComponent**：web原生组件，它有两个核心组成部分：CustomElement和ShadowDom。CustomElement用于创建自定义标签，ShadowDom用于创建阴影DOM，阴影DOM具有天然的样式隔离和元素隔离属性。由于WebComponent是原生组件，它可以在任何框架中使用，理论上是实现微前端最优的方案。但WebComponent有一个无法解决的问题 - ShadowDom的兼容性非常不好，一些前端框架在ShadowDom环境下无法正常运行，尤其是react框架。

**类WebComponent**：就是使用CustomElement结合自定义的ShadowDom实现WebComponent基本一致的功能。

由于ShadowDom存在的问题，我们采用自定义的样式隔离和元素隔离实现ShadowDom类似的功能，然后将微前端应用封装在一个CustomElement中，从而模拟实现了一个类WebComponent组件，它的使用方式和兼容性与WebComponent一致，同时也避开了ShadowDom的问题。并且由于自定义ShadowDom的隔离特性，Micro App不需要像single-spa和qiankun一样要求子应用修改渲染逻辑并暴露出方法，也不需要修改webpack配置。

我们通过上述方案封装了一个自定义标签`micro-app`，它的渲染机制和功能与WebComponent类似，开发者可以像使用web组件一样接入微前端。它可以兼容任何框架，在使用方式和数据通信上也更加组件化，这显著降低了基座应用的接入成本，并且由于元素隔离的属性，子应用的改动量也大大降低。

## 使用方式

接下来我们将分别介绍主应用和子应用的接入方式。

> 以react代码举例

### 主应用

每个自定义标签`micro-app`渲染后就是一个微前端的子应用，它的使用方式类似于iframe标签。

我们需要给标签传递三个基础属性： - name：名称 - url：子应用页面地址 - baseurl：baseurl是基座应用分配给子应用的路由前缀

使用方式如下：



![img](https://pic1.zhimg.com/80/v2-1cb54eb41b60203e1d60497a107c242c_720w.jpg)



### 子应用

如果子应用只有一个页面，没有路由配置，则不需要做任何修改。

如果子应用是多页面，只需要修改路由配置，添加路由前缀。

如下：

window.**MICRO_APP_BASE_URL**是由基座应用下发的路由前缀，在非微前端环境下，这个值为undefined



![img](https://pic1.zhimg.com/80/v2-17fba0550f1f3ed5d3171961feb21c10_720w.jpg)



完成以上配置即可实现微前端的渲染，对源码的改动量很少。当然MicroApp还提供了其它一些能力，如插件系统、数据通信，我们接下来做详细介绍。

## 核心原理

MicroApp 的核心功能在CustomElement基础上进行构建，CustomElement用于创建自定义标签，并提供了元素的渲染、卸载、属性修改等钩子函数，我们通过钩子函数获知微应用的渲染时机，并将自定义标签作为容器，微应用的所有元素和样式作用域都无法逃离容器边界，从而形成一个封闭的环境。

### 概念图



![img](https://pic1.zhimg.com/80/v2-6f00770e8e8b9dc31072ebd8c5eed460_720w.jpg)



### 渲染流程

通过自定义元素`micro-app`的生命周期函数`connectedCallback`监听元素被渲染，加载子应用的html并转换为DOM结构，递归查询所有js和css等静态资源并加载，设置元素隔离，拦截所有动态创建的script、link等标签，提取标签内容。将加载的js经过插件系统处理后放入沙箱中运行，对css资源进行样式隔离，最后将格式化后的元素放入`micro-app`中，最终将`micro-app`元素渲染为一个微前端的子应用。在渲染的过程中，会执行开发者绑定的生命周期函数，用于进一步操作。

### 流程图



![img](https://pic3.zhimg.com/80/v2-bd07f0d6d753cf1cbdad61d3add10a62_720w.jpg)



### 元素隔离

元素隔离源于ShadowDom的概念，即ShadowDom中的元素可以和外部的元素重复但不会冲突，ShadowDom只能对自己内部的元素进行操作。

MicroApp模拟实现了类似的功能，我们拦截了底层原型链上元素的方法，保证子应用只能对自己内部的元素进行操作，每个子应用都有自己的元素作用域。

元素隔离可以有效的防止子应用对基座应用和其它子应用元素的误操作，常见的场景是多个应用的根元素都使用相同的id，元素隔离可以保证子应用的渲染框架能够正确找到自己的根元素。

### 概念图



![img](https://pic2.zhimg.com/80/v2-a45802dcb0e55427737eac4f4910af9d_720w.jpg)



### 实际效果



![img](https://pic2.zhimg.com/80/v2-8eea00c18e14b2bc6237c0ee9363ce09_720w.jpg)



如上图所示，`micro-app`元素内部渲染的就是一个子应用，它还有两个自定义元素 `micro-app-head`、`micro-app-body`，这两个元素的作用分别对应html中的head和body元素。子应用在原head元素中的内容和一些动态创建并插入head的link、script元素都会移动到`micro-app-head`中，在原body元素中的内容和一些动态创建并插入body的元素都会移动到`micro-app-body`中。这样可以防止子应用的元素泄漏到全局，在进行元素查询、删除等操作时，只需要在`micro-app`内部进行处理，是实现元素隔离的重要基础。

可以将`micro-app`理解为一个内嵌的html页面，它的结构和功能都和html页面类似。

### 插件系统

微前端的使用场景非常复杂，即便有沙箱机制也无法避免所有的问题，所以我们提供了一套插件系统用于解决一些无法预知的问题。

插件可以理解为符合特定规则的对象，对象中提供一个函数用于对资源进行处理，插件通常由开发者自定义。

插件系统的作用是对传入的静态资源进行初步处理，并依次调用符合条件的插件，将初步处理后的静态资源作为参数传入插件，由插件对资源内容进一步的修改，并将修改后的内容返回。插件系统赋予开发者灵活处理静态资源的能力，对有问题的资源文件进行修改。

插件系统本身是纯净的，不会对资源内容造成影响，它的作用是统筹各个插件如何执行，当开发者没有设置插件时，则传入和传出的内容是一致的。



![img](https://pic2.zhimg.com/80/v2-b9c6326d5ebbef42a125e0f66969fc41_720w.jpg)



### js沙箱和样式隔离

js沙箱通过Proxy代理子应用的全局对象，防止应用之间全局变量的冲突，记录或清空子应用的全局副作用函数，也可以向子应用注入全局变量用于定制化处理。

样式隔离是指对子应用的link和style元素的css内容进行格式化处理，确保子应用的样式只作用域自身，无法影响外部。

MicroApp借鉴了qiankun的js沙箱和样式隔离方案，这也是目前应用广泛且成熟的方案。

### 预加载

MicroApp 提供了预加载子应用的功能，它是基于requestIdleCallback实现的，预加载不会对基座应用和其它子应用的渲染速度造成影响，它会在浏览器空闲时间加载应用的静态资源，在应用真正被渲染时直接从缓存中获取资源并渲染。



![img](https://pic1.zhimg.com/80/v2-6db91e43cacac2afb645a6a8bd603d20_720w.jpg)



### 资源地址补全

微前端中经常出现资源丢失的现象，原因是基座应用将子应用的资源加载到自己的页面渲染，如果子应用的静态资源地址是相对地址，浏览器会以基座应用所在域名地址补全静态资源，从而导致资源丢失。

资源地址补全就是将子应用静态资源的相对地址补全为绝对地址，保证地址指向正确的资源路径，这种操作类似于webpack在运行时设置publicPath。



![img](https://pic4.zhimg.com/80/v2-81655e00f3a18053720db9d26ee672d7_720w.jpg)



### 生命周期

在微应用渲染时，`micro-app`元素在不同渲染阶段会触发相应的生命周期事件，基座应用可以通过监听事件来进行相应的操作。 

![img](https://pic2.zhimg.com/80/v2-adf14717996af97119954fe961c402e1_720w.jpg)



生命周期列表： - created：当micro-app标签被创建后，加载资源之前执行。 - beforemount：资源加载完成，正式渲染之前执行。 - mounted：子应用已经渲染完成后执行 - unmount：子应用卸载时执行。 - error：当出现破坏性错误，无法继续渲染时执行。

在卸载时，子应用也会接收到一个卸载的事件，用于执行卸载相关操作。

### 数据通信

数据通信是微前端中非常重要的功能，实现数据通信的技术方案很多，优秀的方案可以提升开发效率，减少试错成本。我们也研究了qiankun等微前端框架数据通信的方式，但他们的实现方式并不适合我们，我们尝试直接通过元素属性传递复杂数据的形式实现数据通信。

对于前端研发人员最熟悉的是组件化的数据交互的方式，而自定义元素micro-app作为类WebComponent，通过组件属性进行数据交互必然是最优的方式。但MicroApp在数据通信中遇到的最大的问题是自定义元素无法支持设置对象类型属性，例如`<micro-app data={x: 1}></micro-app>` 会转换为 `<micro-app data='[object Object]'></micro-app>`，想要以组件化形式进行数据通信必须让元素支持对象属性。

为了解决这个问题，我们重写了`micro-app`元素原型链上属性设置的方法，在`micro-app`元素设置对象属性时将传递的值保存到数据中心，通过数据中心将值分发给子应用。

MicroApp中数据是绑定通信的，即每个`micro-app`元素只能与自己指向的子应用进行通信，这样每个应用都有着清晰的数据链，可以避免数据的混乱，同时MicroApp也支持全局通信，以便跨应用传递数据。

### 数据通信概念图



![img](https://pic3.zhimg.com/80/v2-a9579b6984d73a69f5cb3d3f63c803b2_720w.jpg)



## 框架对比

为了更直观的感受Micro App和其它框架的区别，我们使用一张图进行对比。 

![img](https://pic1.zhimg.com/80/v2-60c098ffa4e5e49b8ffc6a93c1d986d8_720w.jpg)

从对比图可以看出，目前开源的微前端框架中有的功能 MicroApp都有，并提供了一些它们不具备的功能，比如静态资源地址补全，元素隔离，插件系统等。

## 业务实践

MicroApp已经在公司内部多个项目中使用，表现良好，尤其是将一些老项目改造成微前端，在项目不受影响的情况下，即降低接入成本，又可以保证项目平稳运行，减小耦合。

## 为什么开源？

当初我们团队打算使用微前端时，调研了市面上实现微前端的框架，可供选择的只有sigle-spa和qiankun。single-spa太过于基础，对原有项目的改造过多，成本太高。剩下的只有qiankun，但因为接入很多老项目，在实际使用中出了很多问题，我们不得不对qiankun的源码进行大量的魔改。在此过程中，我们对微前端的实现方式产生了一些自己的想法，并将这些想法付诸实践，于是有了MicroApp。

目前像qiankun类似提供完善功能的微前端框架太少了，当接入qiankun失败时，没有其他方案可供选择，这是我们当初经历过的痛。所以我们选择将MicroApp开源，一是因为MicroApp有诸多创新点，可以更简单的接入微前端，功能更加丰富，二是可以让大家多一种选择，没有完美的微前端框架，只有选择多了，才知道哪一个更适合自己。

如果你对这个项目感兴趣，可以通过加入组织或提pull requests的方式参与共建，非常欢迎与期待你的加入。

## 导航

GitHub地址：[https://github.com/micro-zoe/micro-app](https://link.zhihu.com/?target=https%3A//github.com/micro-zoe/micro-app)

官网地址：[https://cangdu.org/micro-app](https://link.zhihu.com/?target=https%3A//cangdu.org/micro-app)

特别鸣谢：[qiankun](https://link.zhihu.com/?target=https%3A//qiankun.umijs.org/zh)