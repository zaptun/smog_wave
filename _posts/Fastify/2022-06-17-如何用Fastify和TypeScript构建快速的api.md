---
layout: post
filename: 2022-06-17-如何用Fastify和TypeScript构建快速的api
title: 如何用Fastify和TypeScript构建快速的api
date: 2022-06-17 21:25:36 +0800
categories: Fastify
tags: Fastify 
---

# Fastify

## 介绍

[Fastify](https://www.fastify.io/)是一个 Node.js 框架，专注于以最少的开销提供最佳的开发人员体验和最佳性能。因此，Fastify 服务器高效且具有成本效益。

Fastify 受到 Express、Restify 和 Hapi 的启发，但提供了一种更快且开销更少的替代方案。

尽管 Fastify 是作为通用 Web 开发框架构建的，但它在开发使用 JSON 作为其数据格式的快速 HTTP API 时表现出色。因此 Fastify 可以提高大多数现代应用程序的吞吐量。



## 创建项目

### 1. 初始化&安装依赖

```shell
npm init -y
npm i fastify nodemon mongoose fastify-plugin
npm i -D typescript @types/node @types/pino @types/mongoose
```



### 2. 初始化一个 TypeScript 配置文件

```shell
npx tsc --init
```



### 3. 配置 TypeScript 编译器

首先在根目录下创建一个 src 和一个 build 目录。然后修改 tsconfig.json 文件，如下所示：

```
...
"outDir": "./build", /* 输出目录 */
"rootDir": "./src", /* 源码根目录 */
...
```

这告诉 TypeScript 编译器 src 目录包含我们所有的源代码，而 build 目录包含我们的编译代码。

### 4. 创建代码

1. 在src目录下创建一个index.ts文件，添加如下代码：

```typescript
import { fastify } from 'fastify';
import pino from 'pino';
const Port = process.env.PORT || 7000;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogs';
const server = fastify({
    logger: pino({ level: 'info' })
});

// register plugin below:

const start = async () => {
    try {
        await server.listen(Port);
        console.log('Server started successfully');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
```

2. 通过将以下代码添加到 package.json 的“脚本”部分来添加构建和启动命令：

 ```json
 {
  ...
   "scripts": {
     "build": "tsc -w",
     "dev": "nodemon build/index.js",
     "start": "node build/index.js" 
   },
  ...
 }
 ```

- "build": tsc -w" 在监视模式下运行 TypeScript 编译器
- "dev": "nodemon build/index.js" 在我们编译代码时使用 nodemon 重新启动我们的服务器。
- “start”：“node build/index.js”是启动我们使用节点的服务器的生产命令。

### 5.处理表单文件上传

利用 **fastify-file-upload** 模块，[更多配置](https://github.com/richardgirges/express-fileupload#available-options)

```typescript
'use strict'

const fastify = require('fastify')()
const fileUpload = require('fastify-file-upload')

//默认配置
// fastify.register(fileUpload)

//或，限制上传文件大小
fastify.register(fileUpload, {
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles: true, 
  //默认情况下，这个模块上传文件到RAM。设置此选项为True将启用使用临时文件而不是使用RAM。这可以避免在上传大文件或同时上传大量文件时出现内存溢出问题。
  tempFileDir : '/tmp/'
});

fastify.post('/upload', function (req, reply) {
  // some code to handle file
  const files = req.raw.files
  console.log(files)
  let fileArr = []
  for(let key in files){
    fileArr.push({
      name: files[key].name,
      mimetype: files[key].mimetype
    })
  }
  reply.send(fileArr)
})

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

使用 Schema

```shell
fastify.post('/uploadSchema', {
  schema: {
    summary: 'upload file',
    body: {
      type: 'object',
      properties: {
        file: { type: 'object' }
      },
      required: ['file']
    }
  },
  handler: (request, reply) => {
    const file = request.body.file
    console.log(file)
    reply.send({ file })
  }
})
```

