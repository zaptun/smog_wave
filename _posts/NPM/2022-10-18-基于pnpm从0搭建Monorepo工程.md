---
layout: post
filename: 2022-10-18-基于pnpm从0搭建Monorepo工程
title: 基于pnpm从0搭建Monorepo工程
date: 2022-10-18 13:37:35 +0800
categories: monorepo pnpm
tags: monorepo pnpm
---


## Pnpm

为什么使用pnpm？

pnpm 的特点：快速、高效利用磁盘空间。学习成本低、简单好用。

它将 workspace 的所有依赖都下载到.pnpm目录下，然后再根据各个 package 的情况，在其目录下通过软连接方式将依赖添加进来，这样所有的依赖只需要下载一次，那么不仅快，而且磁盘体积也小。

而且它原生 cli 支持基本的 workspace 管理，这也是我对比下来选择 pnpm 的原因

### 1. 安装pnpm
```
npm install -g pnpm
```

### 2. 创建workspace
```
pnpm init
```

### 3. 根目录创建pnpm-workspace.yaml
```
packages: 
    - "libs/**"
    - "projects/**"
```

### 4. 创建自己的目录结构
```
├── libs
│   ├── core
│   │   ├── package.json
│   │   └── pnpm-lock.yaml
│   ├── ui
│   │   ├── package.json
│   │   └── pnpm-lock.yaml
│   ├── util
│   │   ├── package.json
│   │   └── pnpm-lock.yaml
├── projects
│   ├── demo1
│   │   ├── package.json
│   │   └── pnpm-lock.yaml
│   ├── demo2
│   │   ├── package.json
│   │   └── pnpm-lock.yaml
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## 使用pnpm cli 管理 workspace

### 1. 配置依赖
比如我们的 core 包：
* 各种 Base类
* Http
那么我们需要给 core 安装 axios 以及 qs

比如我们的 demo 工程：
* vue
* vite

以及我们的全局生效的依赖：
* eslint
* mocha
* nyc
* typescript
* ...

这里因为该 Monorepo 都是 vue3 + vite 相关技术栈，所以我把相关依赖也一并安装到 root，这样以后新建的 project 就不用重新安装依赖啦！

### 2. 安装依赖

#### 2.1. 指定工程安装

`-F, --filter <package_name>` 可以指定目标 package 执行任务

```
pnpm i -F core
```

#### 2.2. 一键递归安装

如果多个包都配置好了依赖，想要一键安装怎么办，一个一个包去这样做吗？

`-r, --recursive` 命令可以做到一键递归安装

```
pnpm i -r
```

#### 2.3. 安装全局依赖

比如全局安装 typescript, 这里的-D指令大家都很熟悉，就是把依赖作为devDependencies安装；而-W就是把依赖安装到根目录的node_modules当中。虽然 projects 下的项目都没有安装 ts，但是倘若在项目中使用到，就会通过依赖递归查找的原则逐级往上寻找，自然会找到 monorepo 中根目录的依赖。

```
pnpm install typescript -D -w
```

#### 2.4. 安装局部依赖

对于某些依赖，可能仅存在于某几个 projects 中，我们就可以单独为他们安装，当然，可以通过cd packges/xxx后，执行pnpm install xxx，但这样重复操作多次未免有些麻烦，pnpm 提供了一个快捷指令——filter。

```
pnpm i vue -F @libs/core
```



### 3. 根目录执行命令

除了一些全局生效的命令之外，像我们可以按需求配置执行 project 的启动和打包

```javascript
// root package.json
"script": {
    "dev:demo": "pnpm -F demo dev",
    "build:demo": "pnpm -F demo build"
}

// demo package.json
"scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
}
```

### 4. project 关联 libs

安装好依赖之后，我们可以简单写一点代码到core包里面，比如：
```
// index.ts
export function add(a: number, b: number) {
    return a + b;
}
```

然后我们在demo工程里执行 
```
pnpm i @libs/core -F demo1 demo2
```

我们会发现 demo1 demo2 的 package.json 多了这个
```json
{
    "dependencies": {
        "@libs/core": "workspace:*", // * 代表默认同步最新版本，正常安装完应该是 ^1.0.0
    }
}
```

我们尝试在文件中导入 core 中 add 方法
```javascript
import { add } from "@libs/core";

console.log(add(1, 2));
```

我们就已经成功在项目中引入 libs/core 了

### 5. pnpm publish

执行了pnpm publish后，会把基于的workspace的依赖变成外部依赖，如：
```json
// before  
"dependencies": {
  "@panda/tools": "workspace:^1.0.0"
},

// after
"dependencies": {
  "@panda/tools": "^1.0.0"
},
```
解决了开发环境和生产环境对依赖的问题。


