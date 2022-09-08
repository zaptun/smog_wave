---
layout: post
filename: 2022-09-08-Rust和WebAssembly
title: Rust和WebAssembly
date: 2022-09-08 15:04:45 +0800
categories: rust webassembly
tags: rust webassembly
---

## 准备

新建一个基于rust构建的webassembly的项目;需要如下准备：

- **[wasm-pack][1]** : 构建、测试和发布rust生成的WebAssembly的一站式商店。[wasm-pack 文档][2]
   安装 wasm-pack
   ```shell
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```

- **cargo-generate** : 通过利用现有的git存储库作为模板，帮助您快速启动并运行一个新的Rust项目。使用以下命令安装cargo-generate:
  ```shell
  cargo install cargo-generate
  ```

- **npm** : 确保已经安装了node环境




----

[1]: https://rustwasm.github.io/wasm-pack/installer/

[2]: https://rustwasm.github.io/wasm-pack/book/quickstart.html

[3]: https://rustwasm.github.io/docs/book/game-of-life/introduction.html