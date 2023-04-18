---
layout: post
filename: 2023-03-20-Electron使用加密sqlite方案
title: Electron使用加密sqlite方案
date: 2023-03-20 13:49:04 +0800
categories: Electron sqlite
tags: better-sqlite3 better-sqlite3-multiple-ciphers typeorm
---

## 依赖包:

* better-sqlite3
* better-sqlite3-multiple-ciphers
* typeorm

```
yarn add better-sqlite3 better-sqlite3-multiple-ciphers typeorm
```

## 新建加密db库文件

```typescript
import { join } from "path";
const sqlite3 = require("better-sqlite3-multiple-ciphers");

/* 数据库地址 */
const DB_PATH = join(__dirname, "./bee.db");
/* 数据库密码 */
const PASSWORD = "123abc";

const createDB = (): void => {
  /* 新建数据库 */
  const db = sqlite3(DB_PATH);
  db.pragma(`cipher='sqlcipher'`);
  db.pragma(`legacy=4`);            // sqlcipher 版本
  db.pragma(`rekey='${PASSWORD}'`); // 设置密码
  db.close();
};
createDB();
```

## 连接db库文件


## 遇到问题

### 1. 无法安装 better-sqlite3

参考解决方案: https://github.com/TryGhost/node-sqlite3/issues/1538

```
# 1. 安装 Xcode 开发工具
# 在终端中输入以下命令来安装 Xcode 开发工具：
xcode-select --install


# 2. homebrew 安装 sqlite3
brew install sqlite3

# 3. 配置环境变量
vi .zshrc
# 增加如下内容
#export LDFLAGS="-L/usr/local/opt/sqlite/lib"
#export CPPFLAGS="-I/usr/local/opt/sqlite/include"
export LDFLAGS="-L/opt/homebrew/opt/sqlite/lib"
export CPPFLAGS="-I/opt/homebrew/opt/sqlite/include"
export PKG_CONFIG_PATH="/opt/homebrew/opt/sqlite/lib/pkgconfig"

# 4. 安装
rm -rf node_modules
# yarn add sqlite3 --build-from-source --sqlite=/usr/local/opt/sqlite
# yarn add sqlite3 --build-from-source --runtime=electron --target=18.3.6 --target_arch=arm64 --dist-url=https://atom.io/download/electron
yarn add sqlite3 --build-from-source --sqlite=/usr/local/opt/sqlite --runtime=electron --target=18.3.6 --target_arch=arm64
yarn add better-sqlite3 better-sqlite3-multiple-ciphers
```

以上方法中，第 4 步的 `--build-from-source` 会强制从源代码编译 sqlite3，因此需要安装 Xcode 开发工具。在第 4 步中，我们需要依赖配置 LDFLAGS 和 CPPFLAGS 这两个环境变量，这样才能让编译器找到正确的头文件和库文件。