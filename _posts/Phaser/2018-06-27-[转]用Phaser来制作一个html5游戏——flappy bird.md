---
layout: post
filename: 2018-06-27-【转】用Phaser来制作一个html5游戏——flappy bird
title: 【转】用Phaser来制作一个html5游戏——flappy bird
date: 2018-06-27 20:11:43 +0800
categories: Phaser
tags: Phaser
---

【[原文地址](http://www.cnblogs.com/2050/p/3790279.html)】

最近看看这个引擎学习一下，就是简单做个记录给自己看，想看更详细的可以去看看原文；<br/>
可以参考的一些网站：<br/>
[Phaser官网](http://phaser.io)<br/>
[Phaser Github](https://github.com/photonstorm/phaser)<br/>
[Phaser3官方文档](https://photonstorm.github.io/phaser3-docs/index.html)<br/>
[Phaser官方文档](http://phaser.io/docs/)<br/>
[Phaser CE官方文档](https://photonstorm.github.io/phaser-ce/)<br/>
[Phaser官方示例](http://phaser.io/examples)<br/>
[Phaser小站](https://www.phaser-china.com)<br/>
[Phaser中文网](http://www.phaserengine.com/)<br/>

文档对应参考：

|Core 核心|Game Objects 游戏对象|Geometry 几何图形|Physics 物理引擎|Input 输入|
|--|---|---|---|---|
|Game游戏|Factory (game.add) 工厂|Circle    圆|Arcade Physics    Arcade 物理引擎|Input Handler   输入处理|
|Group  组|Creator (game.make)    创建者|Rectangle  矩形|Body 刚体|Pointer  指针|
|World  世界|Sprite 精灵|Point  点|P2 Physics    P2 物理引擎|Mouse   鼠标|
|Loader 载入器|Image  图像|Line  直线|Body 刚体|Keyboard 键盘|
|Time   时间|Sound  声音|Ellipse    椭圆|Spring   弹簧|Key  按键|
|Camera 摄像机|Emitter    发射器|Polygon  多边形|CollisionGroup  碰撞组|Gamepad 游戏手柄|
|State Manager  状态管理器|Particle   粒子|-|ContactMaterial   接触物质|-|
|Tween Manager  补间动画管理器|Text   文本|-|Ninja Physics   Ninja 物理引擎|-|
|Sound Manager  声音管理器|Tween  补间动画|-|Body    刚体|-|
|Input Manager  输入管理器|BitmapText 位图文字|-|-|-|
|Scale Manager  缩放管理器|Tilemap    瓦片地图|-|-|-|
|-|BitmapData 位图数据|-|-|-|
|-|RetroFont  复古字体|-|-|-|
|-|Button 按钮|-|-|-|
|-|Animation  动画|-|-|-|
|-|Graphics   图形|-|-|-|
|-|RenderTexture  渲染纹理|-|-|-|
|-|TileSprite 瓦片精灵|-|-|-|


    整体流程:
    1. 实例化Phaser
    2. State
    3. 资源加载
    3.1 boot
    3.1.1 FPS
    3.1.2 屏幕适配
    3.2 preload
    4. 游戏菜单加载

### 1.实例化Phaser

Phaser的使用非常简单，只需要引入它的主文件，然后在页面中指定一个用来放置canvas的元素，然后实例化一个 Game 对象就可以了。

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>game</title>
<script src="js/phaser.js"></script>
</head>
<body>
<div id="game_wrap"></div>
<script>
var game = new Phaser.Game(288,505,Phaser.AUTO,'game'); //实例化一个Phaser的游戏实例
</script>
</body>
</html>
```

看看Phaser.Game这个函数都有哪些参数

```javascript
Phaser.Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)
```

* width: 游戏的宽度,也就是用来渲染游戏的canvas的宽度，单位为px
* height: 游戏的高度，也就是用来渲染游戏的canvas的高度，单位为px
* renderer: 使用哪种渲染方式，Phaser.CANVAS 为使用html5画布，Phaser.WEBGL 为使用性能更加好的WebGL来渲染，Phaser.AUTO为自动侦测，如果浏览器支持WebGL则使用WebGL,否则使用Canvas
* parent: 用来放置canvas元素的父元素，可以是一个元素id，也可以是dom元素本身，phaser会自动创建一个canvas并插入到这个元素中。
* state: state可以理解为场景，在这里指定state表示让游戏首先加载这个场景，但也可以不在这里指定state，而在之后的代码中决定首先加载哪个state。关于state我后面还会有详细的说明。
* transparent: 是否使用透明的canvas背景
* antialias: 是否启用抗锯齿
* physicsConfig: 游戏物理系统配置参数

> 以上所有参数都是可选的，它们的默认值以及更详细的信息可以看这里，一般我们只需指定前面那4到5个参数就行了

实例化Game对象后，接下来要做的就是创建游戏会用到的各种场景了，也就是上面说的state，那么怎么才能创建一个state呢？state可以是一个js自定义对象，也可以是一个函数，只要它们存在preload、create、update这三个方法中的任意一个，就是一个合法的state

### 2.State

```javascript
//state可以是一个自定义对象
var state1 = {
    preload : function(){ },
    create : function(){ },
    update : function(){ }    
}

//state也可以是一个构造函数
var state2 = function(){
    this.preload = function(){ };
    this.create = function(){ };
    this.update = function(){ };
}

//只要存在preload、create、update三个方法中的一个就可以了
var state3 = function(){
    this.update = function(){  };
}

//当然state里也可以存在其他属性或方法
var state4 = function(){
    this.create = function(){ };
    this.aaa = function(){ }; //其他方法
    this.bbb = 'hello'; //其他属性
}
```

其中的preload方法，是用来加载资源的，它会最先执行。create方法是用来初始化以及构建场景的，它要等到在preload里加载的资源全部加载完成后才执行。最后update方法是更新函数，它会在游戏的每一帧都执行，以此来创造一个动态的游戏。

在这个游戏中，我们会用到4个state（boot, prelaod, menu, play），我们可以通过`game.state.add()`方法来给游戏添加state，然后用`game.state.start()`方法来调用state,详细信息请看[state的文档](http://phaser.io/docs/2.6.2/Phaser.State.html)

```javascript
var game = new Phaser.Game(288,505,Phaser.AUTO,'game'); 

game.States = {}; //创建一个对象来存放要用到的state
game.State.boot = function(){ ... }  //boot场景，用来做一些游戏启动前的准备
game.State.prelaod = function(){ ... } //prelaod场景，用来显示资源加载进度
game.State.menu = function(){ ... } //menu场景，游戏菜单
game.State.play = function(){ ... } //play场景，正式的游戏部分

//把定义好的场景添加到游戏中
game.state.add('boot',game.States.boot);
game.state.add('preload',game.States.preload); 
game.state.add('menu',game.States.menu); 
game.state.add('play',game.States.play);
 
//调用boot场景来启动游戏
game.state.start('boot');

```

### 3.资源加载(state boot & state preload)

游戏要用到的一些图片、声音等资源都需要提前加载，有时候如果资源很多，就有必要做一个资源加载进度的页面，提高用户等待的耐心。这里我们用一个state来实现它,命名为preload。

#### 3.1 boot

>因为资源加载进度条需要一个进度条的背景图片，所以在制作这个state前，我们还需要另一个最基础的state,用来加载那张进度条图片，我们命名为boot。

```javascript

game.States.boot = function(){
    this.preload = function(){
        game.load.image('loading','assets/preloader.gif'); //加载进度条图片资源
    };
    this.create = function(){
        game.state.start('preload'); //加载完成后，调用preload场景
    };
}

```

##### 3.1.1 Debug FPS

显示FPS，这里用了几个api

1.`game.time.advancedTiming`先要打开开关和一些配置；<br/>

[game.time文档地址](https://photonstorm.github.io/phaser-ce/Phaser.Time.html#Time)

```javascript
game.time.advancedTiming = true; //配置高级分析
game.time.desiredFps = 60; //期望帧率
game.time.slowMotion = 1.0; //正常速度模式
```

API：`game.debug.text(text, x, y, color, font)`

[官方参考文档](https://photonstorm.github.io/phaser-ce/Phaser.Utils.Debug.html#text)


```javascript
game.debug.text('render FPS: ' + (game.time.fps || '--') , 2, 14, "#00ff00", '36px arial');

if (game.time.suggestedFps !== null){
    game.debug.text('suggested FPS: ' + game.time.suggestedFps, 2, 28, "#00ff00", '36px arial');
    game.debug.text('desired FPS: ' + game.time.desiredFps, 2, 42, "#00ff00", '36px arial');
}
```

##### 3.1.2 屏幕适配

Phaser自带屏幕适配的模式，[ScaleManager文档](https://photonstorm.github.io/phaser-ce/Phaser.ScaleManager.html)

```javascript
if(!game.device.desktop){
    // this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    // this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.scale.forcePortrait = true;
    this.scale.refresh();
}
```

最后的boot加入了屏幕适配和高级分析配置如下：

我这里用的是USER_SCALE(会裁去头尾的适配方案)，还可以用SHOW_ALL(可能两边留黑边)，或者EXACT_FIT(会有拉伸变形)；
这个方案类似cover，所以又加了一个css，把canvas 垂直居中；

```javascript
//boot场景，用来做一些游戏启动前的准备
var GameWrapClass = 'game_wrap';
var deviceWidth = document.documentElement.clientWidth || 375; //实际设备宽度
var deviceHeight = document.documentElement.clientHeight || 667; //实际设备宽度
var designWidth = 750; //设计稿宽度
var designHeight = 1334; //设计稿高度
var _scale = deviceWidth / designWidth; //缩放比值

/*canvas 垂直居中*/
var HEAD = document.querySelector('head');
var topDis = (deviceHeight - designHeight/2) / 2;
var canvasClassText = '<style>#' + GameWrapClass + ' canvas{ -webkit-transform: translate3d(0, -' + (topDis < 0 ? topDis : 0) + 'px,0); }</style>';
HEAD.innerHTML += canvasClassText;

game.States.boot = function () {
    // 制作资源加载进度条
    this.preload = function () {
        if(typeof(GAME) !== "undefined") {
            this.load.baseURL = GAME + "/";
        }
        if(!game.device.desktop){
            this.scale.setUserScale(_scale,_scale);
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            // this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.scale.forcePortrait = true;
            this.scale.refresh();
        }
        game.load.image('loadingBarBg', 'assets/img/loadingBarBg.jpg'); //加载进度条图片资源
        game.load.image('loadingBorder', 'assets/img/loadingBorder.png'); //加载进度条图片资源
    };
    this.create = function () {
        game.time.advancedTiming = true;
        game.time.desiredFps = 60;
        game.time.slowMotion = 1.0;

        //加载完成后，调用preload场景
        game.state.start('preload'); 
    };
}
```

#### 3.2 preload

Phaser中资源的加载都是通过 Phaser.Loader 这个对象的方法来完成的,游戏实例的load属性就是指向当前游戏的Loader对象，在我们这里就是game.load。Loader对象有许多方法，不同的方法可以加载不同的资源，例如加载图片我们用的是game.load.image()方法，具体的方法列表请自行参考文档。

在preload这个场景中，我们需要把游戏后面会用到的所有资源都进行加载，然后还要展示一个加载进度条给用户看。Loader对象提供了一个 `setPreloadSprite` 方法，只要把一个sprite对象指定给这个方法，那么这个sprite对象的宽度或高度就会根据当前加载的百分比自动调整，达到一个动态的进度条的效果。

```javascript
//prelaod场景，用来显示资源加载进度
game.States.preload = function () {
    var _progress = 0;
    var _progressText = 0;

    this.preload = function () {
        var loadingBarBg = game.add.tileSprite((game.width - 440) / 2, (game.height - 38) / 2, 1, 38, 'loadingBarBg');
        // var loadingBarBg = game.add.sprite((game.width - 440) / 2, (game.height - 38) / 2, 'loadingBarBg');
        var loadingBorder = game.add.tileSprite((game.width - 440) / 2, (game.height - 38) / 2, 440, 38, 'loadingBorder');

        /* 让bar滚动 */
        this.loadingBarBg = loadingBarBg;
        loadingBarBg.autoScroll(-120, 0);

        /* var mask = game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawCircle(100, 650, 100);
        loadingBarBg.mask = mask; */

        // var preloadSprite = game.add.sprite(50,game.height/2,'loading'); //创建显示loading进度的sprite
        //用setPreloadSprite方法来实现动态进度条的效果
        // game.load.setPreloadSprite(loadingBarBg);

        game.load.onFileComplete.add(function (e) {
            _progress = game.load.progress;
            // setTimeout(function (){
            //  loadingBarBg.width = e/100 * 440;
            // }, 100);
        })

        game.load.onFileError.add(function (e) {
            console.error('resource loading fail:', e);
            throw (e);
        })

        //以下为要加载的资源
        game.load.atlasJSONHash('baseAll', 'assets/img/base.png', 'assets/img/base.json'); //加载sprite
        game.load.bitmapFont('flappy_font', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt'); //显示分数的字体
        game.load.spritesheet('bird', 'assets/img/bird.png', 68, 48, 3); //鸟
        game.load.spritesheet('pipe', 'assets/img/pipes.png', 54, 320, 2); //管道
        game.load.image('ready_text', 'assets/img/get-ready.png'); //get ready图片
        game.load.image('play_tip', 'assets/img/instructions.png'); //玩法提示图片
        game.load.image('game_over', 'assets/img/gameover.png'); //gameover图片
        game.load.image('score_board', 'assets/img/scoreboard.png'); //得分板
        game.load.image('background', 'assets/img/background.png'); //游戏背景图
        game.load.image('ground', 'assets/img/ground.png'); //地面
        game.load.image('title', 'assets/img/title.png'); //游戏标题
        game.load.image('btn', 'assets/img/start-button.png'); //按钮
        game.load.audio('fly_sound', 'assets/sound/flap.wav'); //飞翔的音效
        game.load.audio('score_sound', 'assets/sound/score.wav'); //得分的音效
        game.load.audio('hit_pipe_sound', 'assets/sound/pipe-hit.wav'); //撞击管道的音效
        game.load.audio('hit_ground_sound', 'assets/sound/ouch.wav'); //撞击地面的音效

    }
    this.create = function () {
        // game.state.start('menu'); //当以上所有资源都加载完成后就可以进入menu游戏菜单场景了
    }
    this.render = function () {
        var speed = 1;
        if (this.loadingBarBg.width < (_progress / 100) * 440) {
            if (this.loadingBarBg.width < 440 - speed) {
                this.loadingBarBg.width = this.loadingBarBg.width + 440 * 0.01;
                _progressText = _progressText + speed;
            } else {
                this.loadingBarBg.width = 440;
                _progressText = 100;
            }
            // console.log(_progressText);
        } else {
            if (_progress == 100) {
                console.log("loading done");
                //当以上所有资源都加载完成后就可以进入menu游戏菜单场景了
                game.state.start('menu');
            }
        }
    }

}
```

上面我们提到了Sprite对象，也就是游戏开发中俗称的精灵，同样在Phaser中sprite对象也是制作游戏过程中用得最多的也是最重要的一个对象之一。我们可以用一幅图片来创建一个sprite,然后用Phaser提供给我们的众多属性和方法来对它进行操作。上面我们是利用game.add.sprite()来创建sprite的，并且创建后会自动把它添加到当前的游戏中，game.add代表的是Phaser.GameObjectFactory对象，该对象提供了了一系列快捷方法来方便我们创建游戏的各种组件。我们这里制作的资源加载进度页面非常简单

### 4.游戏菜单场(tileSprite, Sprite)

#### 背景滚动

背景滚动，主要就是利用*[tileSprite文档](https://photonstorm.github.io/phaser-ce/Phaser.TileSprite.html)*的autoScroll方法。

```javascript
/* 方法一 直接用单张图片 */
//当作背景的tileSprite 
var bg = game.add.tileSprite(0, 0, game.width, game.height, 'background');
//当作地面的tileSprite
var ground = game.add.tileSprite(0, game.height - 251, game.width, 251, 'ground');

/*方法二 用sprite图片*/
var bg = game.add.tileSprite(0, 0, game.width, game.height, 'baseAll', 'background');
var ground = game.add.tileSprite(0, game.height - 251, game.width, 251, 'baseAll', 'ground'); 

/*滚动*/
bg.autoScroll(-30, 0); //让背景动起来
ground.autoScroll(-300, 0); //让地面动起来
```


#### 飞的小鸟

然后制作游戏标题，游戏标题flappy bird这几个字是一张图片，然后那个鸟是一个sprite，并且我们在sprite上执行了动画，使它的翅膀看起来是在动的。我要说的是怎么在sprite对象上实现动画。首先在加载鸟的图片时，我们加载的不当当就是一张鸟的图片，我们加载的是一个这样的图片：bird

我们看到这张图片有三只鸟，更确切的说是一只鸟的三个状态，或者说是动画中的三个帧。那我们怎样让他变成动画呢？

在Loader对象中有一个spritesheet的方法，就是专门用来加载这种多帧图片的，我们看一下这个方法：

`spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)`

>spritesheet('给这张图片指定的名称', '图片的地址', '图片中每帧的宽度', '图片中每帧的高度', '最多有几帧', '每帧的外边距', '每帧之间的间隔')

[Loader spritesheet](https://photonstorm.github.io/phaser-ce/Phaser.Loader.html#spritesheet)<br/>

```javascript
var titleGroup = game.add.group(); //创建存放标题的组
titleGroup.create(0, 0, 'baseAll', 'title'); //通过组的create方法创建标题图片并添加到组里

/*动画方法一 spritesheet */
var bird = titleGroup.create(380, 20, 'bird'); //创建bird对象并添加到组里
bird.animations.add('fly'); //给鸟添加动画
bird.animations.play('fly', 15, true); //播放动画

/*动画方法二 从整张图sprite取*/
var bird = titleGroup.create(380, 20, 'baseAll', 'bird01'); //创建bird对象并添加到组里
bird.animations.add('fly', Phaser.Animation.generateFrameNames('bird', 1, 3, '', 2) ); //给鸟添加动画
bird.animations.play('fly', 15, true); //播放动画
bird.scale.setTo(0.5,0.5);

/* 动画二 另外一种写法 */
var bird = game.add.sprite(380, 20, 'baseAll', 'bird01');
bird.scale.setTo(0.5,0.5);
bird.animations.add('fly', Phaser.Animation.generateFrameNames('bird', 1, 3, '', 2));
bird.animations.play('fly', 15, true, false);
titleGroup.add(bird);

titleGroup.x = (game.width - 540) / 2; //调整组的水平位置
titleGroup.y = 300; //调整组的垂直位置
titleGroup.scale.x = 1.3;
titleGroup.scale.y = 1.3;
game.add.tween(titleGroup).to({
    y: 340
}, 1000, null, true, 0, -1, true); //对这个组添加一个tween动画，让它不停的上下移动
```

我们上面那张鸟的图片，每一个鸟的宽高分别是34px和24px,所以frameWidth应该是34，frameHeight是24，然后我们这个动画有三帧，frameMax为3，帧与帧之间没有间隙，margin与spacing都为0。实际上spritesheet方法就是能让我们加载一个图片，并在这个图片上划分出帧来，以后使用这个图片的sprite就可以用这些帧来播放动画啦。要在sprite上实现动画，我们首先还得先定义一个动画，就是定义这个动画是由哪些帧组成的。sprite对象有个animations属性，代表的是Phaser中专门管理动画的对象：AnimationManager，该对象有一个add方法，用来添加动画，还有一个play方法，用来播放动画，它们具体的参数可以参阅文档。

下面再说一个非常重要的对象：Phaser.Group，也就是组。组相当于一个父容器，我们可以把许多对象放进一个组里，然后就可以使用组提供的方法对这些对象进行一个批量或是整体的操作。比如要使组里的对象同意进行一个位移，只需要对组进行位移就可以了，又比如要对组里的所有对象都进行碰撞检测，那么就只需要对这个组对象进行碰撞检测就行了。下面我们要制作的这个游戏标题是由一张文字图片和一支鸟组成的，我们就是把这两个东西放在一个组中，然后来进行整体的操作

>generateFrameNames这个方法参数（'序列帧的前缀','起始帧','结束帧','后缀','序列帧位数, 比如2(01), 4(0001)'）

[animations generateFrameNames文档](https://photonstorm.github.io/phaser-ce/Phaser.Animation.html#_generateFrameNames)<br/>
[如何用TexturePacker创建一个spritesheets](https://www.codeandweb.com/texturepacker/tutorials/creating-spritesheets-for-phaser-with-texturepacker)

上面代码中的Tween对象，是专门用来实现补间动画的。通过game.add的tween方法得到一个Tween对象,这个方法的参数是需要进行补间动画的物体。然后我们可以使用Tween对象的to方法来实现补间动画

to(properties, duration, ease, autoStart, delay, repeat, yoyo)<br/>
to('动画的属性，如{y:120}', '持续的时间', '缓动函数', '是否自动开始', '延迟时间/毫秒', '重复次数，永远为-1', '动画是否自动反转')<br/>

[Tween to](https://photonstorm.github.io/phaser-ce/Phaser.Tween.html#to)<br/>

#### 开始游戏的按钮

最后是添加一个开始游戏的按钮。Phaser提供了Button对象让我们能很简单的实现一个按钮

```javascript
//添加一个按钮
var btn = game.add.button(game.width/2,game.height/2, 'baseAll', function(){
    game.state.start('play'); //点击按钮时跳转到play场景
}, this, 'start_button_down', 'start_button', 'start_button_down', 'start_button');
btn.anchor.setTo(0.5,0.5); //设置按钮的中心点
btn.scale.setTo(1,1);
```

Phaser中很多对象都有一个anchor属性，它表示这个物体的中心点，物体的位置平移、旋转的轴，都是以这个中心点为参照的。所以上面代码中我们要使按钮水平垂直居中，除了要把按钮的x,y属性分别设为游戏的宽高的一半外，还要把按钮的中心点设为按钮的中心

最后我们把所有代码合起来，得到了menu这个state的最终代码

```javascript
//menu场景，游戏菜单
game.States.menu = function () {
    this.create = function () {

        /* 方法一 直接用单张图片 */
        //当作背景的tileSprite 
        // var bg = game.add.tileSprite(0, 0, game.width, game.height, 'background');
        //当作地面的tileSprite
        // var ground = game.add.tileSprite(0, game.height - 251, game.width, 251, 'ground');
        
        /*方法二 用sprite图片*/
        var bg = game.add.tileSprite(0, 0, game.width, game.height, 'baseAll', 'background');
        var ground = game.add.tileSprite(0, game.height - 251, game.width, 251, 'baseAll', 'ground'); 
        
        /*滚动*/
        bg.autoScroll(-30, 0); //让背景动起来
        ground.autoScroll(-300, 0); //让地面动起来

        var titleGroup = game.add.group(); //创建存放标题的组
        titleGroup.create(0, 0, 'baseAll', 'title'); //通过组的create方法创建标题图片并添加到组里

        /*动画方法一 spritesheet */
        // var bird = titleGroup.create(380, 20, 'bird'); //创建bird对象并添加到组里
        // bird.animations.add('fly'); //给鸟添加动画
        // bird.animations.play('fly', 15, true); //播放动画
        
        /*动画方法二 */
        var bird = titleGroup.create(380, 20, 'baseAll', 'bird01'); //创建bird对象并添加到组里
        bird.animations.add('fly', Phaser.Animation.generateFrameNames('bird', 1, 3, '', 2) ); //给鸟添加动画
        bird.animations.play('fly', 15, true); //播放动画
        bird.scale.setTo(0.5,0.5);

        /* 动画二 另外一种写法 */
        // var bird = game.add.sprite(380, 20, 'baseAll', 'bird01');
        // bird.scale.setTo(0.5,0.5);
        // bird.animations.add('fly', Phaser.Animation.generateFrameNames('bird', 1, 3, '', 2));
        // bird.animations.play('fly', 15, true, false);
        // titleGroup.add(bird);
        
        titleGroup.x = (game.width - 540) / 2; //调整组的水平位置
        titleGroup.y = 300; //调整组的垂直位置
        titleGroup.scale.x = 1.3;
        titleGroup.scale.y = 1.3;
        game.add.tween(titleGroup).to({
            y: 340
        }, 1000, null, true, 0, -1, true); //对这个组添加一个tween动画，让它不停的上下移动

        var btn = game.add.button(game.width/2,game.height/2, 'baseAll', function(){//添加一个按钮

            game.state.start('play'); //点击按钮时跳转到play场景
        }, this, 'start_button_down', 'start_button', 'start_button_down', 'start_button');
        btn.anchor.setTo(0.5,0.5); //设置按钮的中心点
        btn.scale.setTo(1,1);

    }
    this.render = function () {
        game.debug.text('FPS:' + game.time.fps || '--', 50, 250, "#e0353f", '36px arial');
        game.debug.text('topDis:' + topDis || '--', 50, 300, "#e0353f", '36px arial');
    }
}
```



