---
layout: post
filename: 2022-08-16-使用ShoeBox制作BitmapFont
title: 使用ShoeBox制作BitmapFont
date: 2022-08-16 14:35:12 +0800
categories: 
tags: 
---

## 制作一个0~9的数字BitmapFont

1. 准备0~9的10张png

2. 使用 Animation -> Frame Sheet 生成一个0~9的合集png
   <img src="../../images/post/使用ShoeBox制作BitmapFont01.png" style="zoom:40%;" />
   <img src="../../images/post/使用ShoeBox制作BitmapFont02.png" style="zoom:40%;" />

3. 使用刚刚的合集图片生成Bitmap Font
   <img src="../../images/post/使用ShoeBox制作BitmapFont03.png" style="zoom:40%;" />

4. 选择xml模板，修改padding为10，修改 txt  chars为 0~9
   
   >注意调整行高（Line Height）和 字间距（Kerning Value）

   调整File Format Loop:
   
   ```javascript
   \t\t<char id="@id" x="@x" y="@y" width="@w" height="@h" xoffset="@sx" yoffset="@sy" xadvance="@advanceX" letter="@letter" /><!-- @letter -->
   ```

   <img src="../../images/post/使用ShoeBox制作BitmapFont04.png" style="zoom:50%;" />

5. 点击保存，得到 png 和 xml 文件 
   <img src="../../images/post/使用ShoeBox制作BitmapFont05.png" style="zoom:45%;" />
   <img src="../../images/post/使用ShoeBox制作BitmapFont06.png" style="zoom:85%;" />

6. 在项目中使用
   
  ```javascript
  let value = 0;

   class Example extends Phaser.Scene
   {
       constructor ()
       {
           super();
       }

       preload ()
       {
           this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
       }

       create ()
       {
           this.dynamic = this.add.bitmapText(0, 500, 'desyrel', '');
       }

       update ()
       {
           this.dynamic.text = 'value: ' + value.toFixed(2);
           value += 0.01;
       }
   }

   const config = {
       type: Phaser.WEBGL,
       parent: 'phaser-example',
       scene: [ Example ]
   };

   const game = new Phaser.Game(config);
  ```