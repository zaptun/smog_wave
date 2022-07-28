# electreon学习

## 1. [主进程和渲染器进程](https://www.electronjs.org/docs/tutorial/application-architecture#主进程和渲染器进程)

Electron 运行 `package.json` 的 `main` 脚本的进程被称为**主进程**。 在主进程中运行的脚本通过创建web页面来展示用户界面。 一个 Electron 应用总是有且只有一个主进程。

由于 Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到。 每个 Electron 中的 web 页面运行在它自己的**渲染进程**中。

在普通的浏览器中，web页面通常在沙盒环境中运行，并且无法访问操作系统的原生资源。 然而 Electron 的用户在 Node.js 的 API 支持下可以在页面中和操作系统进行一些底层交互。

**[主进程和渲染进程之间的区别](https://www.electronjs.org/docs/tutorial/application-architecture#主进程和渲染进程之间的区别)**

主进程使用 `BrowserWindow` 实例创建页面。 每个 `BrowserWindow` 实例都在自己的渲染进程里运行页面。 当一个 `BrowserWindow` 实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有的web页面和它们对应的渲染进程。 每个渲染进程都是独立的，它只关心它所运行的 web 页面。

在页面中调用与 GUI 相关的原生 API 是不被允许的，因为在 web 页面里操作原生的 GUI 资源是非常危险的，而且容易造成资源泄露。 如果你想在 web 页面里使用 GUI 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 GUI 操作。

## 2. 进程间的通信

2种方式：

1. [`ipcRenderer`](https://www.electronjs.org/docs/api/ipc-renderer) -[`ipcMain`](https://www.electronjs.org/docs/api/ipc-main) - 模块发送消息
2.  [remote](https://www.electronjs.org/docs/api/remote) - 在渲染进程中使用主进程模块
3. [webContents](https://www.electronjs.org/docs/api/web-contents#webcontents) -从主进程访问渲染进程

### 2.1 [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderer)

> 从渲染器进程到主进程的异步通信。
>
> 进程: [Renderer](https://www.electronjs.org/docs/glossary#renderer-process)
>
> `ipcRenderer` 是一个 [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) 的实例。 你可以使用它提供的一些方法从渲染进程 (web 页面) 发送同步或异步的消息到主进程。 也可以接收主进程回复的消息。
>
> 请从 [ipcMain](https://www.electronjs.org/docs/api/ipc-main) 查看代码示例。

### 2.2 [ipcMain](https://www.electronjs.org/docs/api/ipc-main#ipcmain)

> 从主进程到渲染进程的异步通信。
>
> 线程：[主线程](https://www.electronjs.org/docs/glossary#main-process)
>
> The `ipcMain` module is an [Event Emitter](https://nodejs.org/api/events.html#events_class_eventemitter). 当在主进程中使用时，它处理从渲染器进程（网页）发送出来的异步和同步信息。 从渲染器进程发送的消息将被发送到该模块。

ipc通信例子

```javascript
// 在主进程中.
const { ipcMain } = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})
```

```javascript
//在渲染器进程 (网页) 中。
const { ipcRenderer } = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
```

### 2.3 [remote](https://www.electronjs.org/docs/api/remote#remote)

> 在[渲染进程](https://www.electronjs.org/docs/glossary#renderer-process)中使用主进程模块。
>
> `remote` 模块为渲染进程（web页面）和主进程通信（IPC）提供了一种简单方法。
>
> 在Electron中, GUI 相关的模块 (如 ` dialog`、`menu` 等) 仅在主进程中可用, 在渲染进程中不可用。 为了在渲染进程中使用它们, `ipc` 模块是向主进程发送进程间消息所必需的。 使用 `remote` 模块, 你可以调用 main 进程对象的方法, 而不必显式发送进程间消息, 类似于 Java 的 [RMI ](https://en.wikipedia.org/wiki/Java_remote_method_invocation)。

**例如：从渲染进程创建浏览器窗口**

```javascript
const { BrowserWindow } = require('electron').remote
let win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://github.com')
```

**注意:** 反过来（如果需要从主进程访问渲染进程），可以使用 [webContents. executeJavascript ](https://www.electronjs.org/docs/api/web-contents#contentsexecutejavascriptcode-usergesture)。

**注意事项：** 因为安全原因，remote 模块能在以下几种情况下被禁用：

- [`BrowserWindow`](https://www.electronjs.org/docs/api/browser-window) - 通过设置 `enableRemoteModule` 选项为 `false`。
- [`<webview>`](https://www.electronjs.org/docs/api/webview-tag) - 通过把 ` enableremotemodule`属性设置成 `false`。

**[将回调传递给主进程](https://www.electronjs.org/docs/api/remote#将回调传递给主进程) 例子：**

```javascript
// 主进程 mapNumbers.js
exports.withRendererCallback = (mapper) => {
  return [1, 2, 3].map(mapper)
}

exports.withLocalCallback = () => {
  return [1, 2, 3].map(x => x + 1)
}
```

```javascript
// 渲染进程
const mapNumbers = require('electron').remote.require('./mapNumbers')
const withRendererCb = mapNumbers.withRendererCallback(x => x + 1)
const withLocalCb = mapNumbers.withLocalCallback()

console.log(withRendererCb, withLocalCb)
// [undefined, undefined, undefined], [2, 3, 4]
```

如您所见，渲染器回调的同步返回值不是预期的，而且在主进程中也与相同回调的返回值不符。

其次，传递给主进程的回调将持续到主进程垃圾回收。

例如，下面的代码乍一看似乎是无辜的。 它为远程对象上的`close`事件安装一个回调

```javascript
//这样绑定的回调将无法释放
require('electron').remote.getCurrentWindow().on('close', () => {
  // window was closed...
})
```

> 但请记住, 回调是由主进程引用的, 直到你显式卸载它。 如果不这样做, 每次重新加载窗口时这个回调将再次被安装, 每次重启时都会泄漏一个回调。
>
> 更糟的是, 由于以前安装的回调的上下文已释放, 因此在发出 `close` 事件时, 将在主进程中引发异常。

为了避免这个问题，请**确保清除对传递给主进程的渲染器回调的引用**。 这涉及到清理事件处理程序, 或者确保主进程被明确告知取消引用来自正在退出的渲染程序的回调。

**[访问主进程中的内置模块](https://www.electronjs.org/docs/api/remote#访问主进程中的内置模块)**

```javascript
const app = require('electron').remote.app
console.log(app)
```

**借助global实现调用**

```javascript
//主进程
global.backgroundparam = {}
```

```javascript
//渲染进程
const data = require('electron').remote.getGlobal('backgroundparam')
```

### 2.4 [webContents](https://www.electronjs.org/docs/api/web-contents#webcontents)

> [主进程](https://www.electronjs.org/docs/glossary#main-process)调用渲染进程方法以及控制 web 页面
>
> `webContents` is an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter). 负责渲染和控制网页, 是 [`BrowserWindow`](https://www.electronjs.org/docs/api/browser-window) 对象的一个属性。 这是一个访问 `webContents` 对象的例子:

```javascript
const { BrowserWindow } = require('electron')

let win = new BrowserWindow({ width: 800, height: 1500 })
win.loadURL('http://github.com')

let contents = win.webContents
console.log(contents)
```

contents可以操控渲染进程的window，修改ua，前进后退等

### 2.5 webview和渲染进程间通信

使用`sendToHost`方法和`ipc-message`事件，可以在嵌入页面和webview之间进行通信

参考：[webview和渲染进程间通信](https://www.electronjs.org/docs/api/webview-tag)

```javascript
// 在包含webview的页面
const webview = document.querySelector('webview')
webview.addEventListener('ipc-message', (event) => {
  console.log(event.channel)
  // Prints "pong"
})
webview.send('ping')
```

```javascript
// 在webview访问页面 或者 webview页面的preload.js内
const { ipcRenderer } = require('electron')
ipcRenderer.on('ping', () => {
  ipcRenderer.sendToHost('pong')
}
```

例子：

preload.js

```javascript
import { ipcRenderer } from "electron";
import addEventListener from "@/utils/nodejs/addEventListener";
import { fileSaveAsOther } from "@/lib/utils";

import { APP_VERSION } from "@/configs/system";
import store from "@/store";
import { startDownloadFile } from "@/sdk/interface/download";
import { _bindAccount } from "@/services/common/login";

const BossHiBridge = {
	/**
   * 绑定Boss直聘账号
   * @param {Object} { wt: "boss直聘的wt票据", phone : "手机号"}
   * @param {Function} callback 回调函数
   */
  bindAccount({ wt, phone }, callback) {
    ipcRenderer.sendToHost("bindAccount", { wt, phone }); // 通知嵌入器绑定账号信息
    ipcRenderer.on("bindAccountBack", (e, b) => {
      callback && callback instanceof Function && callback(b);
    });
  },
}
global.BossHiBridge = BossHiBridge;
export default BossHiBridge;
```

嵌入器页面

```javascript
/**
 * 监听webview消息
 * @returns {null}
 */
ipcMessageListen(webview) {
  webview.addEventListener("ipc-message", async e => {
    if (e.channel == "bindAccount") {
      const res = await _bindAccount(e.args[0]); //绑定boss直聘
      webview.send("bindAccountBack", res);
    } else if (e.channel == "setUnreadNum") {
      this.updateAppDataStates(e.args[0]);
      webview.send("setUnreadNumBack", { code: 0, msg: "设置成功" });
    }
  });
},
```

被webview加载页面test.html

```javascript
BossHiBridge.bindAccount({wt:"9hMA2uWcfvQ1C685s",phone:"140****3615"},function(data){
    console.log(data)
});
```



## 3. 数据共享

数据共享可以是用remote，还有一种方式，就是global.sharedObject，通过这个可以改变共享的数据，实现真正数据共享

### 3.1 global.sharedObject

```javascript
// 在主进程中
global.sharedObject = {
someProperty: 'default value'
}
```

```javascript
// 在第一个页面中
require('electron').remote.getGlobal('sharedObject').someProperty = 'new value'
```

```javascript
// 在第二个页面中
console.log(require('electron').remote.getGlobal('sharedObject').someProperty)
```

## 4. 自定义网络检测

**src/main/utils/netCheck.js**

```javascript
const { spawn } = require("child_process");

/**
 * 网络检测
 *
 * @returns {code: x, msg:"xxx" }  0:检测出错/当前网络不可用, 1:网络正常, 2:网络有延迟, 3:网络请求超时
 */
function netCheck() {
  return new Promise((resolve, reject) => {
    let ping = "";
    let count = 0;
    let countTime = 0;
    ping = spawn("ping", ["baidu.com"]);
    ping.on("close", function(code) {
      // console.log("child process exited with code :" + code);
      resolve({ code: 1, msg: "网络正常" });
    });
    ping.stdout.on("data", function(data) {
      let info = ("stdout: " + data).replace(/\n/g, "");
      count++;
      countTime = countTime + info.replace(/(.*time=)(.*?)(ms)/, "$2") * 1;
      if (/timeout/.test(info)) {
        reject({ code: 3, msg: "网络请求超时" });
        spawn("kill", [ping.pid]);
      }
      if (count > 2) {
        console.log("countTime====>", countTime);
        if (countTime > 500 && count < 4) {
          // console.log("网络延迟500+");
          reject({ code: 2, msg: "网络延迟" });
        } else {
          // console.log("网络正常");
          resolve({ code: 1, msg: "网络正常" });
        }
        spawn("kill", [ping.pid]);
      }
    });
    ping.stderr.on("data", function(data) {
      // console.log("stderr: " + data);
      let info = ("stdout: " + data).replace(/\n/g, "");
      if (/Unknown\shost/.test(info)) {
        reject({ code: 0, msg: "当前网络不可用，请检查网络设置" });
      } else {
        reject({ code: 0, msg: "检测出错" });
      }
    });
  });
}
export default netCheck;
```



**main.js** 引入

```javascript
import netCheck from "@/main/utils/netCheck";
global.netCheck = netCheck;
```

 

**js中调用**

```javascript
const netCheck = require("electron").remote.getGlobal("netCheck");
netCheck()
  .then(data => {
    //网络正常
  })
  .catch(data => {
    //网络不可用或延迟
  });
```



## 5. 获取系统信息

```

```



## 6. 自定义文件下载管理

electron程序，如何监控文件下载进度，并显示进度条？

在`electron`的文件下载过程中，所有的控制层面代码，都是在一个`will-download`事件中进行编写的。所以，这个`will-download`事件，是解题的前提条件。

```javascript
mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
  ...
})
```

这里重点需要专注的就是`item`对象，关键信息都在这个`item`之中存储。这个`item`就可以理解为被下载的这个文件。值得注意的是：

- 下载链接点击触发后，就会触发'will-download'。
- 然后会根据是否存在`item.setSavePath()`语句，来决定是否跳出保存对话框。
- 特别需要注意的是：保存对话框不阻塞进程不阻塞进程，你选择目录的时候，没准都已经下载完了。这个操作很邪门。

**是否出现保存对话框**

如果有设置`item.setSavePath()`，就不会出现保存对话框，如果没有设置，就会出现对话框。这个理解上有些奇怪，不过确实就是这么触发的。

```javascript
mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
  const filePath = path.join(app.getPath('downloads'), item.getFilename());
  item.setSavePath(filePath);
  
})
```

上面的代码，就是把文件默认保存到了`downloads`这个系统目录下面了。

git上有其他人封装的下载组件，可以参考：https://github.com/grim3212/electron-download-manager



## 7. webview标签内a标签点击用浏览器打开

[参考1](https://stackoverflow.com/questions/48914542/cant-open-electron-webview-links-with-target-blank)

[参考2](https://github.com/electron/electron/issues/4191)

```javascript
webview1.addEventListener('new-window', (e) => {
  const protocol = require('url').parse(e.url).protocol
  if (protocol === 'http:' || protocol === 'https:') {
    //awaite shell.openExternal(e.url)
    let win = new BrowserWindow({width: 800, height: 600})
    win.loadURL(e.url);
  }
})
```



## 8. 界面拖动

**-webkit-app-region: drag**   [官方文档](https://www.electronjs.org/docs/api/frameless-window)

### [可拖拽区](https://www.electronjs.org/docs/api/frameless-window#可拖拽区)

默认情况下, 无边框窗口是不可拖拽的。 应用程序需要在 CSS 中指定 `-webkit-app-region: drag` 来告诉 Electron 哪些区域是可拖拽的（如操作系统的标准标题栏），在可拖拽区域内部使用 `-webkit-app-region: no-drag` 则可以将其中部分区域排除。 请注意, 当前只支持矩形形状。

注意: `-webkit-app-region: drag ` 在开发人员工具打开时会出现问题。 查看更多信息 (包括变通方法), 请参见此 [GitHub 问题 ](https://github.com/electron/electron/issues/3647)。

要使整个窗口可拖拽, 您可以添加 `-webkit-app-region: drag` 作为 `body` 的样式:

```html
<body style="-webkit-app-region: drag">
</body>

复制
```

请注意，如果您使整个窗口都可拖拽，则必须将其中的按钮标记为不可拖拽，否则用户将无法点击它们：

```css
button {
  -webkit-app-region: no-drag;
}

复制
```

If you're only setting a custom titlebar as draggable, you also need to make all buttons in titlebar non-draggable.

### [文本选择](https://www.electronjs.org/docs/api/frameless-window#文本选择)

在无框窗口中, 拖动行为可能与选择文本冲突。 例如, 当您拖动标题栏时, 您可能会意外地选择标题栏上的文本。 为防止此操作, 您需要在可区域中禁用文本选择, 如下所选:

```css
.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

复制
```

### [右键菜单](https://www.electronjs.org/docs/api/frameless-window#右键菜单)

在某些平台上，可拖拽区域不被视为窗口的实际内容，而是作为窗口边框处理，因此在右键单击时会弹出系统菜单。 要使上下文菜单在所有平台上都正确运行, 您永远也不要在可拖拽区域上使用自定义上下文菜单。



## 9. 全局错误的捕获



## 10. 系统托盘

[文档](https://www.electronjs.org/docs/api/tray#event-balloon-click)

```javascript
//macOS 设置系统角标
tray.setTitle(title) 
```



## 11. HTTP/HTTPS请求

Fetch.js

```javascript
import path from "path";
import fs from "fs";
import qs from "qs";
import store from "@/store/index";
import https from "https";
import fetch from "node-fetch";
import { PFX_PATH, PFX_PASSPHRASE, APP_VERSION_LONG } from "@/configs/system";
import { ipcMain, remote, ipcRenderer } from "electron";
import { HOST_HTTP } from "@/configs/server";
import Md5 from "crypto-js/md5";
import logger from "@/lib/log";
import apmMonitor from "@/lib/apmMonitor";

/**
 * 获取完整的url地址，拼接上HOST
 * @param {String} url 需要url的path
 * @returns {String}  完整的url地址
 */
function getApiUrl(url) {
  if (HOST_HTTP) {
    return `${HOST_HTTP}${url}`;
  }
  return url;
}

/**
 * 同步延迟
 * @param {Number} ms 延迟的毫秒数
 */
function wait(ms) {
  let start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

/**
 * 获取主进程的对象属性
 * @param {String} name 属性名称
 * @returns {Any} 对应name的属性
 */
function getGlobal(name) {
  try {
    const res = remote.getGlobal(name);
    return res;
  } catch {
    return global[name];
  }
}

/**
 * 对象属性排序
 * @param {Object} obj 需要处理对象
 * @returns {Object} 重新排序后对象
 */
function sortObjByKey(obj) {
  return Object.entries(obj)
    .sort()
    .reduce((a, c) => ((a[c[0]] = c[1]), a), {});
}

/**
 * 删除对象指定属性
 * @param {Object} obj 待处理对象
 * @param {Array} props 要删除的属性字符串数组集
 * @returns {Object} 处理后一个新对象
 */
function rmObjPrototype(obj, props) {
  return Object.keys(obj).reduce((object, key) => {
    if (props.indexOf(key) < 0) {
      object[key] = obj[key];
    }
    return object;
  }, {});
}

/**
 * 对象转化成字符串拼接的path，用于get head请求
 * @param {Object} obj 请求对象
 * @returns {String} 要发送请求的string
 */
function objToPathParam(obj) {
  let result = "";
  for (const [key, value] of Object.entries(obj)) {
    result +=
      result == "" ? `${key}=${value}` : `&${key}=${encodeURIComponent(value)}`;
  }
  return result;
}

/**
 * 请求数据加密
 * @param {Object} obj 要处理的请求数据对象
 * @returns {String} 处理后加密字符串
 */
function encrypt(obj) {
  let keys = Object.keys(obj).sort();
  keys = keys.filter(
    key => obj[key] !== null && obj[key] !== undefined && obj[key] !== ""
  );
  const values = keys
    .map(key => {
      return key + "=" + obj[key];
    })
    .join("&");
  const res = values + `&sk=${store.state.loginInfo.userInfo.sk}`;
  return Md5(res)
    .toString()
    .toUpperCase();
}

/**
 * 日志上报APM并写入本地文件
 * @param {String} type 日志类型
 * @param {Object} res 写入数据
 */
function loggerHttpResponse(type, res) {
  let {
    config = {},
    status = "",
    statusText = "",
    errorCode = "",
    ret,
    retry = 0,
  } = res;
  const { url = "", method, params, data } = config;
  const requestData = method === "get" ? params : qs.parse(data);
  if (type === "error") {
    try {
      statusText = ret.message;
      errorCode = ret.code;
      retry = ret && ret.retry !== "" ? ret.retry : 0;
      // ret = res.response.data;
    } catch (e) {
      // ret = e;
      console.log(e);
    }

    apmMonitor.upload("httpError", "error", {
      desc: {
        method,
        url,
        requestData,
        status,
        statusText,
        errorCode,
        retry,
        data: ret ? JSON.stringify(ret, Object.getOwnPropertyNames(ret)) : "",
      },
    });
  }
  logger("http")[type]({
    method,
    url,
    requestData,
    status,
    statusText,
    errorCode,
    retry,
    data: ret ? JSON.stringify(ret) : "",
  });
}

/* 默认请求头 */
const headers = {
  // Accept: "application/json",
  "Content-Type": "application/json",
};

/* 默认Https agent配置 */
let options = {
  pfx: fs.readFileSync(PFX_PATH),
  passphrase: PFX_PASSPHRASE,
  rejectUnauthorized: false,
  keepAlive: false,
};

/**
 * 处理请求配置和数据
 * @param {Object} config
 * @returns {Object} config
 */
function handleData(config) {
  /* 处理数据 */
  let data = sortObjByKey(config.data);
  const wifiInfo = getGlobal("wifiInfo") || {};
  const networkAddress = getGlobal("networkAddress") || {};
  const { ssid = "", bssid = "" } = wifiInfo;
  const { ip = "", mac = "" } = networkAddress;
  if (/get/i.test(config.method)) {
    let params = config.data || {};
    if (ssid) {
      params.ssid = ssid;
    }
    if (bssid) {
      params.bssid = bssid;
    }
    if (ip) {
      params.ip = ip;
    }
    if (mac) {
      params.mac = mac;
    }
    params.ts = Date.now();
    params.v = APP_VERSION_LONG;
    const s = encrypt(params);
    if (store.state.loginInfo.userInfo && store.state.loginInfo.userInfo.t) {
      params.t = store.state.loginInfo.userInfo.t;
    }
    let obj = sortObjByKey({
      ...params,
      s,
    });
    config.data = obj;
  } else if (/upload/i.test(config.method)) {
    config.method = "POST";
    // data.append("ts", Date.now());
    // data.append("v", APP_VERSION_LONG);
    // if (ssid) {
    //   data.append("ssid", ssid);
    // }
    // if (bssid) {
    //   data.append("bssid", bssid);
    // }
    // if (ip) {
    //   data.append("ip", ip);
    // }
    // if (mac) {
    //   data.append("mac", mac);
    // }
    // if (store.state.loginInfo.userInfo && store.state.loginInfo.userInfo.t) {
    //   data.append("t", store.state.loginInfo.userInfo.t);
    // }
    // config.data = data;
  } else {
    data.ts = Date.now();
    data.v = APP_VERSION_LONG;
    if (ssid) {
      data.ssid = ssid;
    }
    if (bssid) {
      data.bssid = bssid;
    }
    if (ip) {
      data.ip = ip;
    }
    if (mac) {
      data.mac = mac;
    }
    data.s = encrypt(data);
    data = sortObjByKey(data);
    if (store.state.loginInfo.userInfo && store.state.loginInfo.userInfo.t) {
      data.t = store.state.loginInfo.userInfo.t;
    }
    config.data = data;
  }

  const ContentType = config.headers["Content-Type"];
  if (ContentType && ContentType.indexOf("x-www-form-urlencoded") > -1) {
    config.data = qs.stringify(data);
  }
  /* 处理数据end */
  return Object.assign({}, config);
}

/**
 * 统一处理请求
 * @param {Object} config 请求的配置
 * @returns {Promise} 一个promise对象，返回处理的结果
 */
async function makeRequest(_config, _requestErrorCount) {
  return new Promise(async function(resolve, reject) {
    let requestErrorCount = _requestErrorCount || 0;
    try {
      /* 处理请求数据 */
      let config = handleData(_config);

      /* 处理agent配置 */
      options = config.agent ? Object.assign(options, config.agent) : options;
      const sslConfiguredAgent = new https.Agent(options);

      let fetchConfig = {
        headers: config.headers,
        agent: sslConfiguredAgent,
        method: config.method,
        body: config.data,
        redirect: "follow",
        signal: null,
        follow: 20,
        timeout: config.timeout || 5000,
        compress: true,
        size: 0,
      };

      /* 处理GET HEAD不能带body */
      if (/get|head/i.test(fetchConfig.method)) {
        /* 把参数拼接到url */
        const pathParam = objToPathParam(config.data);
        config.url = config.url + (pathParam !== "" ? `?${pathParam}` : "");

        /* 删除body属性 */
        fetchConfig = rmObjPrototype(fetchConfig, ["body"]);
      }

      /* 发送请求 */
      // console.log("fetch====>", config.url);
      const response = await fetch(config.url, fetchConfig);

      /* 获取返回数据 */
      const resData = await response.json();
      // console.log("responseBody===>", resData);

      /* 检查状态码 */
      let { status } = response;
      // console.log("makeRequest status==>", status, response.url);

      // noticeLog({ text: "ajax-response", data: response });
      // logger("http").info(response.config.method === "get");

      if (status === 200) {
        if (resData.code === 0) {
          console.log(
            "makeRequest resolve===>",
            _config.method + " ==> " + _config.url
          );

          loggerHttpResponse("info", {
            config: _config,
            status,
            ret: resData,
          });
          resolve(resData);
        } else if (resData.code === 1401) {
          /* 登出 */
          // store.dispatch("logout");
          loggerHttpResponse("info", {
            config: _config,
            status,
            ret: resData,
          });
          ipcRenderer && ipcRenderer.send
            ? ipcRenderer.send("logout")
            : store.dispatch("logout");
        } else {
          console.log(
            "makeRequest reject===>",
            _config.method + " ==> " + _config.url
          );
          loggerHttpResponse("error", {
            config: _config,
            status,
            ret: resData,
          });
          reject(resData);
        }
      } else {
        loggerHttpResponse("error", { config: _config, status, ret: resData });
        reject(resData);
      }
    } catch (error) {
      console.log(
        `makeRequest error retry_${requestErrorCount} ===>`,
        _config.method + " ==> " + _config.url,
        error
      );
      error.retry = requestErrorCount;
      loggerHttpResponse("error", { config: _config, ret: error });
      if (requestErrorCount < 3) {
        requestErrorCount++; /* 错误计数 */
        wait(requestErrorCount * 500);
        return makeRequest(_config, requestErrorCount);
      } else {
        reject(error);
      }
    }
  });
}

export const $post = function(url, param = {}, config = {}) {
  return makeRequest({
    url: getApiUrl(url),
    method: "POST",
    data: param,
    ...config,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
};

export const $get = function(url, param = {}, config = {}) {
  return makeRequest({
    url: getApiUrl(url),
    method: "GET",
    data: param,
    ...config,
    headers,
  });
};

export function $upload(url, params = {}, config = {}) {
  let _url;
  let headers = {
    "Content-Type": "multipart/form-data",
  };

  // let param = new FormData();
  // if (params.data) {
  //   Object.keys(params.data).forEach(key => {
  //     param.append(key, params.data[key]);
  //   });
  // }

  _url = /^http/.test(url) ? url : getApiUrl(url);

  config = Object.assign({ headers }, config);

  return makeRequest({
    url: _url,
    method: "upload",
    data: params,
    ...config,
  });
}
```

引用

```javascript
import { $get, $post } from "@/main/utils/fetch";
$post("/api/user/web/getQrInfo", params, {
  timeout: 300000,
  agent: {
    keepAlive: true,
  },
});
```



## 12. 应用C++编译的Node包 

### 12.1 C++编译成node包

**前期环境要求：**

- [安装C++编译软件](http://www.mingw.org/) 
- VS 2019
- python 2.7



### 12.2 项目中引入

- 需要`native-ext-loader`

- 在webpack中配置，当是指定的node文件时，用相对路径

  ```javascript
  const DEBUG = process.env.NODE_ENV === "production" ? !1 : !0;  //环境变量
  ...
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: "native-ext-loader",
        options: DEBUG ? {} : {      //根据环境设置basePath
          basePath:['modules']
        }
      },
    ],
  },
  ...
  ```




## 13. 浏览器打开URL

[参考](https://www.electronjs.org/docs/api/shell#shellopenexternalurl-options)

```javascript
shell.openExternal(url[, options\])
```



## 14. 解决electron加载本地文件

[参考](https://github.com/electron/electron/issues/23757)

在创建窗口时加上配置：webPreferences: {      webSecurity: false    }

```javascript
new BrowserWindow({
  width: 800, 
  height: 600,
  webPreferences: {
    webSecurity: false
  }
})
```

高版本可能还会遇到file协议不识别问题：

```javascript
import { protocol } from "electron";

app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });
});
```



------



# 打包签名

## 1. 在macOS上签署Windows应用

有两种方法：

1. JSign
2. osslsigncode

[参考原文](https://www.electron.build/tutorials/code-signing-windows-apps-on-unix)

### 1.1 使用JSign在Mac / Linux上签名Windows应用-EV证书

此方法需要Java。在尝试此解决方案之前，请确保已安装Java。

1. 通过运行java -v确保已安装Java。
2. [下载JSign](https://ebourg.github.io/jsign/)  [JSign from Github](https://github.com/ebourg/jsign/releases)
3. 创建一个名为`hardwareToken.cfg`的文件。用下面的内容填充它。
4. 检查库链接，以确保您具有正确的[PKCS](https://en.wikipedia.org/wiki/PKCS_11)模块。每个令牌的此链接可能有所不同。在Linux上，您可以在/ lib中找到它，而在Mac上，您可以在/ Library / Frameworks或/ usr / local / lib中找到它。
5. 为Mac安装令牌驱动程序，导出证书（如果证书为.cer，则将其转换为pem）
6. 使用正确的参数运行`java -jar jsign-2.1.jar`。

**hardwareToken.cfg**

```javascript
name = HardwareToken
library = /Library/Frameworks/eToken.framework/Versions/A/libeToken.dylib
slotListIndex = 0
```

URLs: - [JSign from Github](https://github.com/ebourg/jsign/releases)

> libeToken.dylib这个库文件需要安装 EV 代码签名证书工具 SafeNet，安装之后就会有
>
> MAC：[点击下载](https://knowledge.digicert.com/solution/SO20503.html)

Full command for signing:

```shell
java -jar jsign-2.1.jar --keystore hardwareToken.cfg --storepass "your password here" --storetype PKCS11 --tsaurl http://timestamp.digicert.com --alias /link/to/cert.pem
```



### 1.2 [JDK自带的keytool证书工具详解](https://www.cnblogs.com/zhi-leaf/p/10418222.html)

查看证书详情：

```shell
keytool -list -keystore NONE -storetype PKCS11 -providerclass sun.security.pkcs11.SunPKCS11 -providerArg ./build/win/hardwareToken.cfg -v
```

修改别名：

```shell
keytool -changealias -keystore NONE -storetype PKCS11 -providerclass sun.security.pkcs11.SunPKCS11 -providerArg ./build/win/hardwareToken.cfg  -keystore NONE -alias my_name -destalias "Beijing Huapin Borui Internet Technology Co.,Ltd."
```

> my_name是证书中当前的alias，-destalias指定的是要修改为的alias



### 1.3 总结

**整体步骤**：

1. 准备文件

   1. jsign-2.1.jar  [下载地址](https://github.com/ebourg/jsign/releases)

   2. 签名证书工具 SafeNet [点击下载](https://knowledge.digicert.com/solution/SO20503.html)

   3. hardwareToken.cfg 内容如下

      ```javascript
      name = HardwareToken
      library = /Library/Frameworks/eToken.framework/Versions/A/libeToken.dylib
      slotListIndex = 0
      ```

   4. sign-win.js

      ```javascript
      const CERTIFICATE_NAME = "Beijing Huapin Borui Internet Technology Co.,Ltd.";
      
      exports.default = async function(configuration) {
        // const tokenPassword = () => {
        //   if (!process.env.TOKEN_KEY) {
        //     process.env.TOKEN_KEY = require("readline-sync").question(
        //       "\n\n\tPlease enter the password for the hardware token: ",
        //       {
        //         hideEchoBack: true
        //       }
        //     );
        //   }
        //   return process.env.TOKEN_KEY;
        // };
        const tokenPassword = "FIb0@7!ZjSxY5k@O";
        console.log("configuration==>",configuration)
        require("child_process").execSync(
          `java \
          -jar scripts/jsign-2.1.jar \
          --keystore scripts/hardwareToken.cfg \
          --storepass "${tokenPassword}" \
          --storetype PKCS11 \
          --tsaurl http://timestamp.digicert.com \
          --alias "${CERTIFICATE_NAME}" \
          "${configuration.path}"
          `,
          {
            stdio: "inherit"
          }
        );
      };
      ```

   5. builder.yml 配置文件中配置好 `sign : "scripts/sign-win.js"`

      ```xml-dtd
      afterSign: "scripts/build/notarize.js"
      appId: "com.zhipin.hi"
      productName: "Boss Hi"
      copyright: "Copyright © 2019 BOSS直聘"
      
      artifactName: "BossHi${env.SERVER_TARGET}-${arch}-${version}.${ext}"
      buildDependenciesFromSource: true
      npmRebuild: false
      files:
        from: "build/certificate${env.SERVER_TARGET}"
        to: "certificate${env.SERVER_TARGET}"
        filter:
          - "!**/node_modules/@ffmpeg-installer/win32-x64/**.*"
          - "!**/node_modules/@journeyapps/sqlcipher/{src,deps}/**.*"
          - "!**/node_modules/@journeyapps/sqlcipher/{**.md,LICENSE}"
          - "!**/node_modules/@journeyapps/sqlcipher/lib/binding/node-v64-win32-x64/**.*"
          - "!**/node_modules/@journeyapps/sqlcipher/lib/binding/electron-v8.2-win32-ia32/**.*"
          - "!**/node_modules/@journeyapps/sqlcipher/lib/binding/electron-v8.2-win32-x64/**.*"
      
      # https://www.electron.build/configuration/win
      win:
        icon: "build/icons/icon.ico"
        publish:
          provider: generic
          url: https://img.bosszhipin.com/v2/upload/bosshi/win/
          channel: "latest"
          useMultipleRangeRequest: true
          publishAutoUpdate: true
        target:
          - target: nsis
            arch:
              - ia32
              # - x64
        # signingHashAlgorithms: ["sha1"]
        # rfc3161TimeStampServer: http://timestamp.comodoca.com/rfc3161
        # timeStampServer: http://timestamp.digicert.com
        extraResources:
          - from: build/win/packages
            to: build/win/packages
        # publisherName: ["北京华品博睿网络技术有限公司"]
        verifyUpdateCodeSignature: false
        requestedExecutionLevel: "asInvoker"
        # certificateSubjectName: "北京华品博睿网络技术有限公司"
        signAndEditExecutable: true
        signDlls: true
        sign : "scripts/sign-win.js"
      
      # https://www.electron.build/configuration/mac
      mac:
        hardenedRuntime: true
        gatekeeperAssess: false
        entitlements: "scripts/build/entitlements.mac.plist"
        entitlementsInherit: "scripts/build/entitlements.mac.plist"
        icon: "build/icons/icon.icns"
        category: public.app-category.utilities
        target: ["zip", "dmg"]
        publish:
          provider: generic
          url: https://img.bosszhipin.com/v2/upload/bosshi/mac/
          channel: "latest"
          useMultipleRangeRequest: true
          publishAutoUpdate: true
      
      # https://www.electron.build/configuration/linux
      linux:
        icon: "build/icons"
      
      # https://www.electron.build/configuration/nsis
      nsis:
        oneClick: false
        perMachine: true
        allowToChangeInstallationDirectory: true
        allowElevation: true
        installerIcon: "build/icons/icon.ico"
        uninstallerIcon: "build/icons/icon.ico"
        installerHeaderIcon: "build/icons/icon.ico"
        createDesktopShortcut: true
        createStartMenuShortcut: true
        shortcutName: "Boss Hi"
        # include: "build/script/installer.nsh"
      
      # https://www.electron.build/configuration/dmg
      dmg:
        sign: false
        background: "build/mac/dmg/background.tiff"
        icon: "build/icons/icon.icns"
        iconSize: 88
        iconTextSize: 12
        title: "${productName}"
        contents:
          - x: 410
            y: 150
            type: link
            path: "/Applications"
          - x: 130
            y: 150
            type: file
        window:
          width: 555
          height: 350
      
      extraResources:
        - from: build/icons
          to: build/icons
      ```

      

> 中途还遇到别名不对的，用1.2的keytool修改别名





------



# 踩坑

## 1. 渲染报错

遇到错误：Unable to create basic Accelerated OpenGL renderer







## 2. sass报错

运行：

```shell
npm rebuild node-sass
```



## 3. 退出后重新登录store数据没有清除

当`app.relaunch`多次调用时，多个实例将在当前实例退出后启动。

立即重新启动当前实例并向新实例添加新命令行参数的示例：

```javascript
app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
app.exit(0)
```



## 4. 图片只显示一半

还没下载好就缓存了，通过在地址后加时间戳跳过缓存。



## 5.  Unable to install `vue-devtools`:

[参考](https://github.com/SimulatedGREG/electron-vue/issues/242)

```shell
npm install vue-devtools --save-dev
```



## 6. asar包反解

执行：npx asar extract app.asar feishu

报错提示：Attempt to access memory outside buffer bounds

```shell
npx asar extract app.asar feishu
```



## 7. windows无法拖拽文件发送

https://github.com/electron/electron/issues/12460. electron文件拖拽这个issue

因为打包申请了最高权限，被系统UAC保护了

```javascript
requestedExecutionLevel: "requireAdministrator"
```

改成申请普通权限就可以了

```javascript
requestedExecutionLevel: "asInvoker"
```



## 8. windows打包ia32应用

windows一直提示SQLite Node找不到，因为要electron-builder install-app-deps要指定环境，运行这个：

```javascript
npx electron-builder install-app-deps --platform win32 --arch ia32
```

然后去: /node_modules/@journeyapps/sqlcipher/lib/binding/electron-v8.2-win32-ia32看有木有文件生成

之后发现打包出来的安装包太大，应该是包含64和32两个，

所以在package里面改

```json
"postinstall": "node ./scripts/postinstall.js && electron-builder install-app-deps --platform win32 --arch ia32",
```

## 9. 隐藏Electron Security Warning

electron-vue编程的时候出现如下错误：
Electron Security Warning (Node.js Integration with Remote Content) This renderer process has Node.js integration enabled and attempted to load remote content. This exposes users of this app to severe security risks.

如果出现上述warning，可以在main.js添加：

```javascript
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
```

或者在packjson加上这个环境变量

## 10. 启动BossHi报错，签名失败

启动BossHi报错，签名失败

>Application Specific Information:
>dyld: launch, loading dependent libraries
>
>Dyld Error Message:
>  Library not loaded: @rpath/Electron Framework.framework/Electron Framework
>  Referenced from: /Volumes/*/Boss Hi.app/Contents/MacOS/Boss Hi
>  Reason: no suitable image found.  Did find:
> /Volumes/Boss Hi/Boss Hi.app/Contents/MacOS/../Frameworks/Electron Framework.framework/Electron Framework: code signature in (/Volumes/Boss Hi/Boss Hi.app/Contents/MacOS/../Frameworks/Electron Framework.framework/Electron Framework) not valid for use in process using Library Validation: mapped file has no Team ID and is not a platform binary (signed with custom identity or adhoc?)
> /Volumes/Boss Hi/Boss Hi.app/Contents/MacOS/../Frameworks/Electron Framework.framework/Electron Framework: stat() failed with errno=1

解决方案：https://github.com/electron-userland/electron-builder/issues/3940

把原来的plist配置文件做个修改调整

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
<key>com.apple.security.cs.allow-jit</key>
<true/>
<key>com.apple.security.cs.allow-unsigned-executable-memory</key>
<true/>
<key>com.apple.security.cs.allow-dyld-environment-variables</key>
<true/>
<key>com.apple.security.cs.disable-library-validation</key>
<true/>
</dict>
</plist>
```

