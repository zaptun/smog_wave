---
layout: post
filename: 2022-10-20-centos安装puppeteer
title: centos安装puppeteer
date: 2022-10-20 23:54:22 +0800
categories: puppeteer 无头浏览器
tags: puppeteer 无头浏览器
---


## 1.查看centos系统版本
hostnamectl

## 2. 查看 .local-chromium 包依赖
ldd node_modules/puppeteer/.local-chromium/linux-1036745/chrome-linux/chrome

## 3. 查询依赖对应库名称
到这个网站查询 https://pkgs.org/search/?q=libatk-bridge-2.0.so.0

## 4. 安装对应64位包
yum -y install atk at-spi2-atk install cups-libs libdrm libxcb libxkbcommon libX11 libXcomposite libXdamage libXext libXfixes libXrandr mesa-libgbm pango cairo alsa-lib at-spi2-core

## 5. 运行报错
browser = await puppeteer.launch({ 
    headless: true,
    args: [
        '--no-sandbox',
    ], 
});

## 6. 字体乱码
yum groupinstall "Fonts"