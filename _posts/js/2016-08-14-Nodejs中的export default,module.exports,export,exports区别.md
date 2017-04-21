---
layout: post
filename: 2016-08-14-Nodejs中的export default,module.exports,export,exports区别
title: Nodejs中的export default,module.exports,export,exports区别
date: 2016-08-14 16:34:13 +0800
categories: NodeJs
tags: NodeJs
---

nodejs中有export default,module.exports,export,exports这几种写法，我们看看都有什么区别.

## module.exports与exports

>module.exports可以单独的定义，返回数据类型，而export只能是返回一个object对象。如
module.exports=['劳黑炭','百度经验','module.exports'];//正确
exports=['劳黑炭','百度经验','module.exports'];//报错

每一个node.js执行文件，都自动创建一个module对象，同时，module对象会创建一个叫exports的属性，初始化的值是 {}

```javascript
module.exports = {};
```

Node.js为了方便地导出功能函数，node.js会自动地实现以下这个语句，例如：

foo.js

```javascript
exports.a = function() {
 console.log('a')
}

exports.a = 1
```

test.js

```javascript
var x = require('./foo');

console.log(x.a)
```

看到这里，相信大家都看到答案了，exports是引用 module.exports的值。module.exports 被改变的时候，exports不会被改变，而模块导出的时候，真正导出的执行是module.exports，而不是exports
