---
layout: post
filename: 2019-02-02-photoshop批量导出ios-launchimage脚本
title: photoshop批量导出ios-launchimage脚本
date: 2019-02-02 12:38:07 +0800
categories: PS
tags: PS
---


#### 将以下脚本保存到一个单独的纯文本文件中，后缀名改为 *.jsx，然后在 PS CS6或 PS CC 2014 新版中通过 “文件” 菜单— “脚本” — “浏览” 运行

***准备好一个 2208 x 2208 launch 图片***

```
//调用[File]的[openDialog]命令，弹出文件选择窗口，并将文件存储在变量[bigIcon]中。

var bigIcon = File.openDialog("请选择一张2208X2208启动图片：", "*.png", false);

//打开用户选择的图片文件，并将打开后的文档，赋予变量[pngDoc]。

var pngDoc = open(bigIcon, OpenDocumentType.PNG);

var document = app.activeDocument;

//调用[Folder]的[selectDialog]命令，弹出文件夹选择窗口，提示用户选择输出iOS图标的文件夹。

//并将文件夹存储在变量[destFolder]中。

var destFolder = Folder.selectDialog("请选择一个输出的文件夹：");

var width = 2208,
    height = 2208;

//定义一个数组，这个数组由各种js对象组成，每个对象都有一个[name]属性和[size]属性，分别表示图标的名称的尺寸。

var icons =

    [

        //android

        { "name": "splash240x282", "width": 240, "height": 282 },

        { "name": "splash320x442", "width": 320, "height": 442 },

        { "name": "splash480x762", "width": 480, "height": 762 },

        { "name": "splash720x1242", "width": 720, "height": 1242 },

        { "name": "splash1080x1882", "width": 1080, "height": 1882 },

        { "name": "splash1080x1920", "width": 1080, "height": 1920 },

        //ios

        { "name": "splash320x480", "width": 320, "height": 480 },

        { "name": "splash640x960", "width": 640, "height": 960 },

        { "name": "splash640x1136", "width": 640, "height": 1136 },

        { "name": "splash750x1334", "width": 750, "height": 1334 },

        { "name": "splash768x1004", "width": 768, "height": 1004 },

        { "name": "splash768x1024", "width": 768, "height": 1024 },

        { "name": "splash1024x748", "width": 1024, "height": 748 },

        { "name": "splash1125x2436", "width": 1125, "height": 2436 },

        { "name": "splash1242x2208", "width": 1242, "height": 2208 },

        { "name": "splash1536x2008", "width": 1536, "height": 2008 },

        { "name": "splash1536x2048", "width": 1536, "height": 2048 },

        { "name": "splash2048x1496", "width": 2048, "height": 1496 },

        { "name": "splash2048x1536", "width": 2048, "height": 1536 },

        { "name": "splash2208x1242", "width": 2208, "height": 1242 },

        //iTunesArtwork

        { "name": "iTunesArtwork", "width": 1024, "height": 1024 }

    ];

//定义一个变量[option]，表示iOS输出的格式为PNG。并设置输出PNG时不执行PNG8压缩，以保证图标质量。

var option = new PNGSaveOptions();

//保存当前的历史状态，以方便缩放图片后，再返回至最初状态的尺寸。

option.PNG8 = false;

var startState = pngDoc.historyStates[0];

//添加一个循环语句，用来遍历所有图标对象的数组。

for (var i = 0; i < icons.length; i++)

{

    //定义一个变量[icon]，表示当前遍历到的图标对象。

    var icon = icons[i];

    //定义一个变量[bounds]，用来表示文档需要裁切的区域，即裁切从坐标[0,0]至[140,104]的区域。

    //注意Photoshop坐标原点在左上角。

    var bounds = [width / 2 - icon.width / 2, height / 2 - icon.height / 2, width / 2 + icon.width / 2, height / 2 + icon.height / 2];

    //调用[document]对象的[crop]方法，来裁切当前文档。

    document.crop(bounds, 0);

    //定义一个变量[destFileName]，表示要导出的图标的名称。

    var destFileName = icon.name + ".png";

    //定义一个变量[file]，表示图标输出的路径。

    var file = new File(destFolder + "/" + destFileName);

    //调用[pngDoc]的[saveAs]方法，将缩小尺寸后的图标导出到指定路径。

    pngDoc.saveAs(file, option, true, Extension.LOWERCASE);

    //将[doc]对象的历史状态，恢复到尺寸缩放之前的状态，即恢复到1024*1024尺寸，为下次缩小尺寸做准备。

    pngDoc.activeHistoryState = startState;

}

//操作完成后，关闭文档。

pngDoc.close(SaveOptions.DONOTSAVECHANGES);

```