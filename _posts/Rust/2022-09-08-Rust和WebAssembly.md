---
layout: post
filename: 2022-09-08-Rust和WebAssembly
title: Rust和WebAssembly
date: 2022-09-08 15:04:45 +0800
categories: rust webassembly
tags: rust webassembly
---

## 准备

新建一个基于rust构建的webassembly的项目：

## 1. 用wasm-pack 

- **[wasm-pack][1]** : 构建、测试和发布rust生成的WebAssembly的一站式商店。[wasm-pack 文档][2]
  
  1. 安装 wasm-pack
  
   ```shell
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```
  
  2. 升级 wasm-pack
   ```shell
   
   ```

  3. 卸载 wasm-pack
  ```shell

  ```

- **cargo-generate** : 通过利用现有的git存储库作为模板，帮助您快速启动并运行一个新的Rust项目。使用以下命令安装cargo-generate:
  ```shell
  cargo install cargo-generate
  ```

- **npm** : 确保已经安装了node环境

### 1.1. 新建工程

使用 [wasm-pack][4] 命令安装。

```shell
wasm-pack new myproject
```
### 1.2. 默认带的依赖包
- **wasm-bindgen**: 用于WebAssembly和JavaScript之间的通信。
- **console_error_panic_hook**: 用于将紧急消息记录到开发人员控制台。
- **wee_alloc**: 代码优化压缩模块。


## 2. 用rsw

### 2.1. 安装

需要先安装好

- Pre-installed
- rust
- nodejs
- wasm-pack

rsw常用命令

```shell
cargo install rsw

# help
rsw -h

# rsw.toml - initial configuration
rsw init

# generate a wasm project
rsw new <name>

# dev mode
rsw watch

# release mode
rsw build

# clean - link & build
rsw clean
```

## 3. 常见功能

### 实现console.log

```rust
extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn say_hello_from_rust() {
    log("Hello from Rust World!");
}
```

### 调用js暴露的方法

build给nodejs的包

`wasm-pack build --target nodejs`

```rust
#[wasm_bindgen(module = "/tests/mk.js")]
extern "C" {
    fn mk(s: &str);
}

// 暴露方法给JS: greet
#[wasm_bindgen]
pub fn greet(d: String) -> String {
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2 + &d;
    mk(&s3);
    // 返回结果
    return s3;
}
```
**mk.js**

```javascript
module.exports.mk = function (m){
    return console.log("log ===>", m);
}
```




----

## 常见问题

### rust unresolved import
有时候，明明在Cargo.toml中的dependencies已经引入了crate，如：cargo add 
xxxx，但是在代码中引入crate，就是会提示如下错误：

`unresolved import`

此时可以试着，在项目根目录下面，运行如下命令：

```shell
cargo clean
cargo build
```

### println! 提示格式错误

当使用println!打印，提示无法使用默认格式设置程序对std::result::Result<reqwest::Response和reqwest::Error>进行格式设置。

使用 `"{:?}"` 而不是 "{}" 调试输出。

```rust
println!("{:}", data);
```

### tokio wasm-pack打包错误

tokio = { version = "=1.21.0", features = ["full"] }

因为不能编译mio(tokio依赖库),但它还没有得到完全的支持[参考][5];但是web-sys可以用来通过Node.js或浏览器发出请求。



----

[1]: https://rustwasm.github.io/wasm-pack/installer/
[2]: https://rustwasm.github.io/wasm-pack/book/quickstart.html
[3]: https://rustwasm.github.io/docs/book/game-of-life/introduction.html
[4]: https://rustwasm.github.io/wasm-pack/book/commands/new.html
[5]: https://cloud.tencent.com/developer/ask/sof/1314645