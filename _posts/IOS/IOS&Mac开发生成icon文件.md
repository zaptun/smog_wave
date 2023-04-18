---
layout: post
filename: 2023-01-02-IOS&Mac开发生成icon文件
title: IOS&Mac开发生成icon文件
date: 2023-01-02 14:19:03 +0800
categories: mac icon
tags: icon
---

## 1. 生成icon

```shell
#bash
mkdir tmp.iconset/
sips -z 22 22     topbaricon.png --out tmp.iconset/appLogo_macOS.png
sips -z 44 44     topbaricon.png --out tmp.iconset/appLogo_macOS@2X.png
sips -z 16 16     logo.png --out tmp.iconset/icon_16x16.png
sips -z 32 32     logo.png --out tmp.iconset/icon_16x16@2x.png
sips -z 32 32     logo.png --out tmp.iconset/icon_32x32.png
sips -z 64 64     logo.png --out tmp.iconset/icon_32x32@2x.png
sips -z 64 64     logo.png --out tmp.iconset/icon_64x64.png
sips -z 128 128   logo.png --out tmp.iconset/icon_64x64@2x.png
sips -z 128 128   logo.png --out tmp.iconset/icon_128x128.png
sips -z 256 256   logo.png --out tmp.iconset/icon_128x128@2x.png
sips -z 256 256   logo.png --out tmp.iconset/icon_256x256.png
sips -z 512 512   logo.png --out tmp.iconset/icon_256x256@2x.png
sips -z 512 512   logo.png --out tmp.iconset/icon_512x512.png
sips -z 1024 1024   logo.png --out tmp.iconset/icon_512x512@2x.png
iconutil -c icns tmp.iconset -o tmp.iconset/icon.icns

# icotool 需要 brew install icoutils
icotool -c tmp.iconset/icon_256x256.png -o tmp.iconset/icon.ico

```

## 2. 生成ico图标
1. 安装icoutils
`brew install icoutils`
2. 生成ico图标
`icotool -c  icon_256x256.png -o icon.ico`

## 3. 生成tiff
先生成 background.png，用mac自带 "预览" 打开文件，然后选取“文件”>“导出”
点按“格式”弹出式菜单，然后选取文件类型, 如果未看到所需文件类型，请按住 Option 键点按“格式”弹出式菜单以查看专用格式或较早格式
