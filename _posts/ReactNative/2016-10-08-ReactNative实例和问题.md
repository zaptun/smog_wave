---
layout: post
filename: 2016-10-08-ReactNative实例和问题
title: ReactNative实例和问题
date: 2016-10-08 21:58:09 +0800
categories: ReactNative
tags: ReactNative
---

## 1.开发环境搭建(for mac)

1. 安装nodejs

2. 用homebrew安装watchman和flow
    
        sudo brew install watchman
        sudo brew install flow

3. 利用npm安装ReactNative

    ```
    sudo npm i -g react-native-cli
    ```

4. 新建项目

    ```
    react-native init projectname
    ```

5. 核心文件：

>ReactNativeProject-xxx/ios/LuckyStar/AppDelegate.m<br>
>ReactNativeProject-xxx/index.ios.js

## 2.打离线ipa包问题

1. 先生成bundle

    ```
    react-native bundle --dev false --entry-file index.ios.js --bundle-output ios/main.jsbundle --platform ios
    ```

2. 修改AppDelegate.m文件
 
    注释

        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

    添加
    
        jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

        #ifdef DEBUG
            jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
        #else
            jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
        #endif


3. 添加app icon

4. xcode->Product->archive

## 3.引用本地图片问题

在Images.xcassets里面加图片，注意名字要***小写开头***

![image](../images/post/reactnative01.jpg)

然后在js里面可以直接调用：

```{uri: 'app_icon'}```<br>
***<Image style={styles.welcomeLogo} source=\{\{uri: 'image'\}\} />***

## 4.app启动页面自定义

找到 ***LaunchScreen.xib***，点击，右边有视图编辑

![image](../images/post/reactnative02.png)

## 5.最小线宽问题

```javascript
1/PixelRatio.get()  //PixelRatio的get方法来获取高清设备的像素比，拿到最小线宽
//例子
var styles = StyleSheet.create({
    box: {
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#ff9900'
    }
});
```