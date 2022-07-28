---
layout: post
filename: 2022-06-09-IOS&iPhone开发
title: IOS&iPhone开发
date: 2022-06-09 20:40:29 +0800
categories: 
tags: 
---

# 苹果APP开发

## 1. APP上传

[文档](https://help.apple.com/app-store-connect/#/devb1c185036)

[App管理](https://appstoreconnect.apple.com/)

[苹果开发者网站](https://developer.apple.com/)

## 2.ios把ipa包放在自己的非https服务器上

[参考](https://www.jianshu.com/p/2f5ec1ab46f4) 

> Git  服务器上是manifest.plist
>
> 网站上是：ipa包, 57图片, 512图片

1. 准备好企业签名包,一张57x57，一张512x512尺寸的icon，manifest.plist文件。所需的manifest.plist文件模版：https://github.com/tc976562936/ticket  把里面的链接修改成自己服务器的

2. 上传manifest.plist文件到自己的github，点击Raw复制manifest.plist文件的链接

   **manifest.plist** 内容

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
   	<key>items</key>
   	<array>
   		<dict>
   			<key>assets</key>
   			<array>
   				<dict>
   					<key>kind</key>
   					<string>software-package</string>
   					<key>url</key>
   					<string>http://tapaobrunei.com/app/Tapao.ipa</string>
   				</dict>
   				<dict>
   					<key>kind</key>
   					<string>display-image</string>
   					<key>url</key>
   					<string>http://tapaobrunei.com/app/tapao57x57.png</string>
   				</dict>
   				<dict>
   					<key>kind</key>
   					<string>full-size-image</string>
   					<key>url</key>
   					<string>http://tapaobrunei.com/app/tapao512x512.png</string>
   				</dict>
   			</array>
   			<key>metadata</key>
   			<dict>
   				<key>bundle-identifier</key>
   				<string>app.tapao.com</string>
   				<key>bundle-version</key>
   				<string>1.0.0</string>
   				<key>kind</key>
   				<string>software</string>
   				<key>platform-identifier</key>
   				<string>com.apple.platform.iphoneos</string>
   				<key>title</key>
   				<string>Tapao</string>
   			</dict>
   		</dict>
   	</array>
   </dict>
   </plist>
   ```

3. 把复制好的链接写入download.html下载页面里

4. 把两张icon和ipa包，还有在手机浏览器里的下载网页download网页放在自己服务器上

5. 在手机浏览器里访问download下载网页