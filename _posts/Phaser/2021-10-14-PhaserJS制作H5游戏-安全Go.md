---
layout: post
filename: 2021-10-14-PhaserJS制作H5游戏-安全Go
title: PhaserJS制作H5游戏-安全Go
date: 2021-10-14 17:20:01 +0800
categories: 
tags: 
---

## 功能开发代码示例

### 不显示phaser verison
```javascript
const config: Phaser.Types.Core.GameConfig = {
  banner: {
    hidePhaser: !0, //隐藏版本log
  },
  ...
};
```

### 游戏启动后动态加载资源

```javascript
/* 加载外部头像 */
// this 是一个 new container
this.shape = this.scene.make.graphics({});

const subLoadCompleted = () => {
  const avatar = this.scene.add.image(0, 0, "avatar");
  /* 设置图片显示大小 */
  avatar.setDisplaySize(100, 100);

  /* 遮罩 */
  this.shape.fillStyle(0xffffff);
  this.shape.beginPath();
  this.shape.moveTo(0, 0);
  this.shape.arc(0, 0, 50, 0, Math.PI * 2);
  this.shape.fillPath();
  /* 如果container移动要跟着改变shape x y */
  this.shape.x = x;
  this.shape.y = y;
  const mask = this.shape.createGeometryMask();
  avatar.setMask(mask);
  this.add(avatar);

  /* 外部头像框 */
  const headframe = this.female ? "headsframe_red" : "headsframe_blue";
  const hf = scene.add.image(0, 0, "sprites", headframe);
  this.add(hf);
};
scene.load.once("complete", subLoadCompleted, this);
scene.load.image("avatar", this.avatarURL);
scene.load.start();
```

### 图片遮罩
```javascript
this.shape.fillStyle(0xffffff);
this.shape.beginPath();
this.shape.moveTo(0, 0);
this.shape.arc(0, 0, 50, 0, Math.PI * 2);
this.shape.fillPath();
/* 如果container移动要跟着改变shape x y */
this.shape.x = x;
this.shape.y = y;
const mask = this.shape.createGeometryMask();
avatar.setMask(mask);
```

### 屏幕自适应全屏剪裁显示和居中
```javascript
const config: Phaser.Types.Core.GameConfig = {
  ...
  scale: {
    mode: Phaser.Scale.ENVELOP, //剪裁显示
    autoCenter: Phaser.Scale.CENTER_BOTH, //自动居中
    parent: "game",
    width: 750,
    height: 1334,
  }
};
```

### 显示FPS
直接在代码做，还可以独立做个scene，开发环境加载，非开发环境不加载这个scene
```javascript
create(): void {
  this.infoText = this.add.text(100, 100, "FPS: -- \n-- Other: XXX", {
    font: "bold 38px PingFangSC-Regular",
    color: "#ffffff",
  });
}
update(time: number, delta: number): void {
  this.infoText.setText("FPS: " + (1000 / delta).toFixed(3) + "\nOther: XX");
}
```

### 限制FPS渲染
```javascript
const config: Phaser.Types.Core.GameConfig = {
  fps: {
    forceSetTimeOut: !0, //强制限制
    target: 30, //目标帧
    panicMax: 30, //手动指定
  },
  ...
};

```

### 按钮按下和抬起效果
```javascript
function create (){
  //需要设置可以交互属性
  this.starButton = this.add.image(cw / 2, ch / 2 + 165, "btStart").setInteractive();
  //开始按钮呼吸特效
  this.buttonTween = this.tweens.add({
    targets: this.starButton,
    scale: 1.1,
    paused: false,
    yoyo: true,
    repeat: -1,
    duration: 800,
  });

  //按下开始按钮,停止动画并增加hover效果
  this.starButton.on("pointerdown", (): void => {
    this.starButton.setTint(0xcccccc);
    this.buttonTween.stop();
    this.starButton.setScale(0.95);
  });

  //松开开始按钮,恢复动画并去掉hover效果
  this.starButton.on("pointerup", (): void => {
    this.starButton.clearTint();
    this.buttonTween.resume();
  });
}
```

### 全局Scene插件

game.ts

```javascript
import { DebugPlugin } from "../plugins/debug";
const config: Phaser.Types.Core.GameConfig = {
  plugins: {
    scene: [{ key: "debugPlugin", plugin: DebugPlugin, mapping: "debugPlugin" }],
  },
}
```

debug.ts
```javascript
export class DebugPlugin extends Phaser.Plugins.ScenePlugin {
  private infoText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
    super(scene, pluginManager, "DebugPlugin");
  }

  init(): void {
    console.log("DebugPlugin init => ");
  }

  create(): void {
    console.log("DebugPlugin create => ", this);

    //显示FPS
    this.infoText = this.scene.add.text(600, 100, "FPS: -- \n-- Other: XXX", {
      font: "bold 38px PingFangSC-Regular",
      color: "red",
    });
  }

  update(time: number, delta: number): void {
    this.infoText.setText("FPS: " + (1000 / delta).toFixed(3) + "\nOther: XX");
  }
}
```

在具体的scene中调用
```javascript
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MenuScene",
    });
  }

  create(): void {
    //plugin
    this.debugPlugin["create"](600, 100);
  }

  update(time: number, delta: number): void {
    this.debugPlugin["update"](time, delta);
  }
}
```
### debug-scene用来显示调试数据
debug-scene.ts
```javascript
export class DebugScene extends Phaser.Scene {
  private infoText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "DebugScene",
      active: !0,
    });
  }

  create(): void {
    //置顶层
    this.scene.bringToTop();

    const container = this.add.container(500, 100);

    //底色
    const rect = new Phaser.Geom.Rectangle(0, 0, 300, 100);
    const graphics = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.5 } });
    graphics.fillRectShape(rect);
    container.add(graphics);

    //显示FPS
    this.infoText = this.add.text(0, 10, "FPS: --", {
      font: "bold 33px PingFangSC-Regular",
      color: "#ffffff",
    });
    container.add(this.infoText);
  }

  update(time: number, delta: number): void {
    this.infoText.setText("FPS: " + (1000 / delta).toFixed(3));
  }
}
```

### 矩形绘制
```javascript
var rect = new Phaser.Geom.Rectangle(250, 200, 300, 200);
var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
graphics.fillRectShape(rect);
```

### 背景音乐播放+跨场景调用方法
可以把背景音乐放到loadinScene里面，设置为改场景visible为false，就不会暂用渲染资源
loading-scene.ts
```javascript
export class LoadingScene extends Phaser.Scene {
  private loadingState: string; //loading状态: unstart|loading|done
  private loadingTotal: number; //loading整体状态: 0~100
  private loadingProcess: number; //loading进度: 0~100
  private interval: NodeJS.Timer; //定时器
  private bgMusic: Phaser.Sound.BaseSound;

  constructor() {
    super({
      key: "LoadingScene",
      visible: !1,  //设置不可见
    });
    //初始化配置
    this.loadingState = "unstart";
    this.loadingProcess = 0;
  }

  //预加载游戏资源
  preload(): void {
    this.load.audio("bgMusic", "assets/audio/bg.mp3");
  }

  create(): void {
    console.log("LoadingScene => create");
    this.bgMusic = this.sound.add("bgMusic", { loop: !0 });
  }

  toggleBgMusic(): void {
    console.log("LoadingScene toggleBgMusic =>");
    this.bgMusic.play();
  }
} 
```

### 切换到后台暂停音乐
```javascript
//切到后台，暂停音乐
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (!this.mute) {
      this.bgMusic.pause();
    }
  } else {
    if (!this.mute) {
      this.bgMusic.resume();
    }
  }
});
```

### 加载sprites-sheet
用免费的软件`ShoeBox`, [ShoeBox官网](https://renderhjs.net/shoebox/)，生成sprites-sheet文件，然后再loading-scene加载；

```javascript
//加载
this.load.atlas("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");

//使用
this.add.image(200, 200, "sprites", "zoom-in");

```

### 加载重复图片 tileSprite

```javascript
this.add.tileSprite(200, 200, 255, 255, "sprites", "zoom-in");
```

### 加载Frame逐帧动画
用免费的软件`ShoeBox`, [ShoeBox官网](https://renderhjs.net/shoebox/)，选animation ，生成Frame Sheet文件，然后再loading-scene加载；

```javascript
//加载
this.load.spritesheet("ef-click", "assets/sprites/ef-click89x90.png", {
  frameWidth: 89,
  frameHeight: 90,
  endFrame: 1,
});

//使用方法1
this.anims.create({
  key: "guideClick",
  frames: "ef-click",
  frameRate: 20,
  repeat: -1,
});

const spriteClick = this.add.sprite(100, 200, "ef-click").play("guideClick");

//使用方法2
/* laoding时创建 头像特效1 */
this.anims.create({
  key: "blue-light",
  frames: this.anims.generateFrameNames("sprites", { prefix: "blue-light", start: 1, end: 2, zeroPad: 2 }),
  frameRate: 6,
  repeat: -1,
});

/* 给场景添加 sprites */
this.anim = scene.add.sprite(0, 0, "sprites");

/* 播放动效 */
this.anim.play("blue-light");

//增加动画的点击响应区域
this.anim.setInteractive({ hitArea: new Phaser.Geom.Rectangle(0, 0, cw, ch) });
```

### 用合集精灵图片生成逐帧动画
用免费的软件`ShoeBox`, [ShoeBox官网](https://renderhjs.net/shoebox/)，选Sprites ，生成Sprite Sheet文件，然后再loading-scene加载；

利用 `generateFrameNames`

```javascript
//1. 加载图片资源
this.scene.load.atlas('sprites', 'sprites.png', 'sprites.json');

//2. 创建全局动画
this.scene.anims.create({
    key: 'germ1',
    frames: this.anims.generateFrameNames('sprites', { prefix: 'red', start: 1, end: 3, zeroPad: 3 }),
    frameRate: 8,
    repeat: -1
});

//3. 场景加载sprite
const anim = this.scene.add.sprite(100, 100, "sprites");

//4. 播放动画
anim.play("sprites");
```


### PNG连续逐帧动画

[Animation From Png Sequence](http://127.0.0.1:8080/edit.html?src=src/animation/animation from png sequence.js)

如果逐帧的单张png是很大的, 不方便合成一个大图,就采用png连续逐帧动画.

```typescript
this.anims.create({
    key: 'snooze',
    frames: [
        { key: 'cat1' },
        { key: 'cat2' },
        { key: 'cat3' },
        { key: 'cat4', duration: 50 }
    ],
    frameRate: 8,
    repeat: -1
});

this.add.sprite(400, 300, 'cat1').play('snooze');
```

### 画圆
```javascript
//1. 实心圆  x坐标 y坐标 半径 
const circleBg = new Phaser.Geom.Circle(200, 200, 100);
const graphics = this.scene.add.graphics({ fillStyle: { color: 0xffffff } });
graphics.fillCircleShape(circleBg);

//2. 空心圆
const circleBg = new Phaser.Geom.Circle(200, 200, 100);
const graphics = this.scene.add.graphics({ lineStyle: { width: 3, color: 0x00ff00 } });
graphics.strokeCircleShape(circleBg);

//3. 带边线的圆
const circle = new Phaser.Geom.Circle(200, 200, 100);
const graphics = this.scene.add.graphics({ 
  lineStyle: { width: 3, color: 0x00ff00 },
  fillStyle: { color: 0xff0000 },
});
graphics.fillCircleShape(circle);
graphics.strokeCircleShape(circle);
```

### 画圆角矩形 + 边框 + 文字

```javascript
graphics = this.add.graphics();
//矩形填充颜色
graphics.fillStyle(0xffff00, 1);
//28px 圆角
graphics.fillRoundedRect(102, 102, 300, 200, 28);

//边框宽度 和 填充颜色
graphics.lineStyle(4, 0x03a8fe, 1);
//  32px 圆角
graphics.strokeRoundedRect(100, 100, 304, 204, 32);

//填充文字
this.add
.text(220, 30, "3、不要忽略同学们的\n电脑屏幕，点开可能\n会有意外的发现。", {
  font: "bold 30px Helvetica,PingFangSC-Regular",
  color: "#482f49",
})
.setLineSpacing(6);
```

### 文字描边 + 线性渐变
```javascript
const text = this.add.text(25, 250, "Gradient", { fontFamily: "Arial Black", fontSize: 82 });
//文本描边
text.setStroke('#000000', 14);
//  渐变填充
const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
gradient.addColorStop(0, '#111111');
gradient.addColorStop(.5, '#ffffff');
gradient.addColorStop(.5, '#aaaaaa');
gradient.addColorStop(1, '#111111');
```

### 设置 Container 点击
先加入container，再设置点击区域，绘制一个矩形
>注意： container 的 origin 默认是0.5，而且不能调整，内部元素也都按照0.5来设置布局，不建议设置成0，后期计算会带来问题，比如设置scale时；
>
>重点，要给Container设置宽高，然后setInteractive，从0，0绘制矩形或圆型交互区域
```javascript
const box = this.add.container(0,0);
box.setSize(599, 550);
box.setInteractive(new Phaser.Geom.Rectangle(0, 0, 599, 550), Phaser.Geom.Rectangle.Contains);
```

### 跨场景调用方法
```javascript
const MainScene = this.scene.get("MainScene");
MainScene["zoomMap"]("in");
```

### 设置图片层级

setDepth方法, 相当于z-index, 数字越大层级越高

```javascript
//场景置顶
this.load.image('ayu', 'assets/pics/ayu2.png');
const image3 = this.add.image(100, 300, 'ayu');
image3.setDepth(1);
```

### 调整场景的层级
```javascript
//场景置顶
this.scene.bringToTop();
//场景置底
this.scene.sendToBack();
```

### 多图片拼接地图
```javascript
//绘制地图
setMap(): void {
  //地图容器
  this.mapContainer = this.add.container(0, 0); //4900, 5625
  this.mapContainer.name = "mapContainer";

  //line1
  for (let i = 1; i < 6; i++) {
    const map = this.add.image(980 * (i - 1), 0, "bg_map_" + i).setOrigin(0);
    this.mapContainer.add(map);
  }
  //line2
  for (let i = 6; i < 11; i++) {
    const map = this.add.image(980 * (i - 6), 1125, "bg_map_" + i).setOrigin(0);
    this.mapContainer.add(map);
  }
  //line3
  for (let i = 11; i < 16; i++) {
    const map = this.add.image(980 * (i - 11), 1125 * 2, "bg_map_" + i).setOrigin(0);
    this.mapContainer.add(map);
  }
  //line4
  for (let i = 16; i < 21; i++) {
    const map = this.add.image(980 * (i - 16), 1125 * 3, "bg_map_" + i).setOrigin(0);
    this.mapContainer.add(map);
  }
  //line5
  for (let i = 21; i < 26; i++) {
    const map = this.add.image(980 * (i - 21), 1125 * 4, "bg_map_" + i).setOrigin(0);
    this.mapContainer.add(map);
  }
}

//设置主摄像机
setMainCamera(): void {
  this.cameras.main.setBounds(0, 0, 4900, 5625);
  // this.cameras.main.setZoom(1);
  // this.cameras.main.centerOn(7732 * 0.6, 5019 / 2);
  /* 跟随主角 */
  this.cameras.main.startFollow(p);
}

```

### 文字自动换行
```javascript
//方法1
this.add
      .text(
        300,
        400,
        [
          "测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容。",
        ],
        {
          font: "bold 30px Helvetica,PingFangSC-Regular",
          color: "#1f2337",
        }
      )
      .setLineSpacing(6)
      .setOrigin(0.5)
      .setWordWrapWidth(400,true);

//方法2
this.make.text({
        x: 400,
        y: 375,
        text: "测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容。",
        origin: { x: 0.5, y: 0.5 },
        style: {
            font: "bold 25px Arial",
            fill: "white",
            wordWrap: { 
              width: 300, 
              useAdvancedWrap: true 
            }
        }
    });
```



### 音效播放

先用音频剪辑软件把多个音效拼到一个MP3内，软件比如`sound`, 然后加载配置，这里笔者是直接把内容在loading-scene内处理了

`loading-scene.ts`，思路：先建两个（container）池，POOL 和 LAYOUT。一个用于存放已经create好的元素，LAYOUT用来show元素，show完的回收到POOL；

```javascript
export class LoadingScene extends Phaser.Scene {
  private bgMusic1!: Phaser.Sound.BaseSound;
  private bgMusic2!: Phaser.Sound.BaseSound;
  private bgMusic3!: Phaser.Sound.BaseSound;
  private effectMusic: Phaser.Sound.BaseSound;
  private musicMark: Array<Record<string, unknown>>;

  constructor() {
    super({
      key: "LoadingScene",
      visible: !1,
    });
    //初始化配置
  	//...
    this.musicMark = [  //start 开始的时间位置，duration 持续的时间
      { name: "fail", start: 0, duration: 0.4, config: {} },
      { name: "defeat", start: 1, duration: 1.2, config: {} },
      { name: "right", start: 2.9, duration: 2.8, config: {} },
      { name: "ding", start: 6, duration: 1.2, config: {} },
      { name: "allright", start: 7.8, duration: 2.6, config: {} },
      { name: "prize", start: 11, duration: 5.0, config: {} },
      { name: "ready", start: 16.5, duration: 2.5, config: {} },
      { name: "oh", start: 19.5, duration: 2.5, config: {} },
      { name: "ondream", start: 22, duration: 2.5, config: {} },
    ];
  }

	 //预加载游戏资源
  preload(): void {
    //audio
    this.load.audio("bg1", "assets/audio/bg1.mp3");
    this.load.audio("bg2", "assets/audio/bg2.mp3");
    this.load.audio("bg3", "assets/audio/bg3.mp3");
    this.load.audio("effect", ["assets/audio/effect.mp3"], {
      instances: 4,
    });
  }

  /* 绑定音乐 */
  create(): void {
    //设景音乐（循环）
    this.bgMusic1 = this.sound.add("bg1", { loop: !0 });
    this.bgMusic2 = this.sound.add("bg2", { loop: !0 });
    this.bgMusic3 = this.sound.add("bg3", { loop: !0 });
    /* 添加mark */
    this.effectMusic = this.sound.add("effect", { loop: !0 });
    for (let i = 0; i < this.musicMark.length; i++) {
      const v = this.musicMark[i];
      this.effectMusic.addMarker(v);
    }

    //全局静音状态值false
    this.registry.set("mute", !1);
  }

  //暴露播放音乐方法，之后用跨场景调用方法，来播放音效
  playEffect(type: string): void {
    const isMute = this.registry.get("mute");
    if (isMute) return;
    this.effectMusic.play(type);
  }

  //播放背景音乐
  playBg(index: number): void {
    const isMute = this.registry.get("mute");
    if (isMute) return;

    this.bgMusic1.stop();
    this.bgMusic2.stop();
    this.bgMusic3.stop();

    this[`bgMusic${index}`].play();
  }
}
```

### 多个场景叠加

```typescript
//完成引导
done(): void {
  //显示内容
  this.bgMask.setVisible(!1);
  this.messageBox.setVisible(!1);
  //启动UI场景叠加
  this.scene.launch("MainUIScene");
  this.scene.launch("MissionScene");
  this.scene.setActive(!1);
}
```

### 打字机效果

```

```

### 图片淡入淡出

有两种方案，一种是染色（Tint）

[tween tint](http://127.0.0.1:8080/edit.html?src=src/display/tint/tween%20tint.js)

```typescript
const image = this.add.image(400, 300, 'face');

this.tweens.addCounter({
    from: 0,
    to: 255,
    duration: 600,
    onUpdate: function (tween)
    {
        const value = Math.floor(tween.getValue());

        image.setTint(Phaser.Display.Color.GetColor(value, value, value));
    }
});
```

另一种是，透明度（Alpha）

[Alpha](http://127.0.0.1:8080/index.html?dir=display/alpha/&q=)

```typescript
const image = this.add.image(400, 300, 'face');
// 四个角分别设置，top left, top right, bottom left, bottom right
image.setAlpha(0, 0, 1, 1);
// 整体设置
image.setAlpha(0.5);
```

### 监听数据变化

主要用 `changedata` 事件

```typescript
//监听数据变化
this.registry.events.on("changedata", this.updateData, this);

//更新分数板数据
updateData(parent: unknown, key: string, data: string | number): void {
  console.log("updateData", key);
  if (key === "score") {
    this.scoreText.setText("剩余风险点: " + data);
  } else if (key === "mute") {
    const isMute = this.registry.get("mute");
    console.log("isMute", data);
    if (isMute) {
      this.audioOff.setVisible(!0);
      this.audioOn.setVisible(!1);
    } else {
      this.audioOff.setVisible(!1);
      this.audioOn.setVisible(!0);
    }
  } else if (key === "viewOriginPoint") {
    // this.viewOriginPoint = this.registry.get("viewOriginPoint");
  }
}
```

### 气泡左右摇摆悬浮

利用tween, yoyo

```typescript
sence.tweens.create({
    targets: page02_pop,
    x: -50,
    y: 40,
    ease: "Linear",
    paused: false,
    yoyo: true,
    repeat: -1,
    duration: 5000,
});
```





### 通过配置批量创建初始化元素

不同类型的元素初始化配置

```json
//图片
{
    name: "prizeBg",
    config: {
        type: "image",
        alpha: 0.5,
        imageName: "prizeBg",
        x: cw / 2,
        y: ch / 2,
        interactive: true, //是否响应互动
    },
},
//容器
{
    name: "textBox",
    config: {
        type: "container",
        x: 546,
        y: 530,
        width: 83,
        height: 83,
    },
},
//文本，父容器是textBox
{
    name: "text",
    config: {
        parentName: "textBox",
        type: "text",
        x: 0,
        y: 0,
        origin: 0.5,
        fontSize: 33,
      	lineSpacing: 16,
        color: "#ffffff",
        text: "再玩一次",
    },
},
//spirit 合集
{
    name: "prize02_Show",
    config: {
        type: "sprite",
        x: cw / 2,
        y: ch * 0.3 + 120,
        imageName: "prize",
        spriteName: "baozhen",
    },
},
```

比如一个奖励页面场景，`prize-scene.ts`

```javascript

```

### 遮罩绘制头像

```javascript
/* 加载头像图片 */
const avatar = this.scene.add.image(0, 0, this.id + "avatar");
/* 设置指定大小显示 */
avatar.setDisplaySize(100, 100);

/* 设置圆形图形 */
this.shape = this.scene.make.graphics({});
this.shape.fillStyle(0xffffff);
this.shape.beginPath();
this.shape.moveTo(0, 0);
this.shape.arc(0, 0, 50, 0, Math.PI * 2);
this.shape.fillPath();

/* 建立遮罩 */
const mask = this.shape.createGeometryMask();

/* 给头像设置遮罩 */
avatar.setMask(mask);

```

### 扩展Scene类

phaserScenePlug.ts

```javascript
//初始化元素配置
export type elementConfigData = {
  name: string;
  type: string; //GameObjectType: image|sprite|container|graphics|text
  parentName?: string; //parent-name
  x: number; //x
  y: number; //y
  width?: number; //width
  height?: number; //height
  depth?: number; //层级
  alpha?: number; //透明度 0~1
  imageName?: string; //image-name 图片资源名称
  spriteName?: string; //sprite-name 具体的spirit元素名称
  origin?: number; //origin 0 | 0.5
  interactive?: boolean; //interactive 是否交互
  interactiveArea?: Phaser.Geom.Rectangle; //interactiveArea 交互区域
  visible?: boolean; //visible 是否渲染
  lineSpacing?: number; //lineSpacing 行间距 | 行高
  lineHeight?: number; //lineHeight
  wrapWidth?: number; //WrapWidth
  fixedWidth?: number; //fixedWidth 最多显示的宽度
  color?: string; //文字颜色
  scale?: number; //缩放设置
  fillColor?: number; //矩形填充色
  fillAlpha?: number; //填充透明度
  radius?: number; //圆角
  font?: string; //字体设置
  fontFamily?: string; //字体
  fontSize?: number; //字体大小
  text?: string | Array<string>; //文字内容
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  borderWidth?: number; //边框宽度
  borderColor?: string; //边框颜色
  borderColorAlpha?: number; //边框颜色透明度
};

//游戏元素
export type PhaserGameElement =
  | Phaser.GameObjects.Container
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Graphics
  | Phaser.GameObjects.Text
  | null;

//游戏元素
export declare class BeeSceneType extends Phaser.Scene {
  renderElement: (e: Array<elementConfigData>) => void;
  getElementByName: (e: string) => PhaserGameElement | Phaser.GameObjects.GameObject;
  parseParentSeries: (e: Array<elementConfigData>) => void;
}

// 扩展Scene类
export class BeeScene extends Phaser.Scene {
  /**
   * 渲染元素
   *
   * @param scene - [Phaser.Scene]
   * @param elementList - [Array<elementConfigData>]
   */
  renderElement(elementList: Array<elementConfigData>): void {
    /* 场景 */
    // const sc = scene;
    /* 要渲染的元素列表 */
    const els = elementList;

    if (els.length > 0) {
      for (let i = 0; i < els.length; i++) {
        const v = els[i];

        /* 获取属性 */
        const name = v.name;
        const type = v.type;
        const x = v.x;
        const y = v.y;
        const parentName = v.parentName;
        const width = v.width;
        const height = v.height;
        const imageName = v.imageName;
        const spriteName = v.spriteName;
        const origin = v.origin;
        const alpha = v.alpha;
        const depth = v.depth;
        const interactive = v.interactive;
        const interactiveArea = v.interactiveArea;
        const visible = v.visible;
        const lineSpacing = v.lineSpacing;
        const wrapWidth = v.wrapWidth;
        const textStyle = v.textStyle;
        const lineHeight = v.lineHeight;
        const fixedWidth = v.fixedWidth;
        const color = v.color;
        const font = v.font || "bold 30px Helvetica,PingFangSC-Regular";
        const scale = v.scale;
        const fillColor = v.fillColor || 0x000000;
        const fillAlpha = v.fillAlpha || 1;
        const radius = v.radius || 0;
        const fontFamily = v.fontFamily;
        const fontSize = v.fontSize;
        const text = v.text;
        const borderWidth = v.borderWidth || 0;
        const borderColor = v.borderColor || "#333333";
        const borderColorAlpha = v.borderColorAlpha || 1;

        /* 渲染元素 */
        let element: PhaserGameElement = null;
        switch (type) {
          case "image":
            imageName && (element = this.add.image(x, y, imageName));
            break;
          case "sprite":
            spriteName && imageName && (element = this.add.image(x, y, imageName, spriteName));
            break;
          case "container":
            element = this.add.container(x, y);
            //设置宽高
            width && height && element.setSize(width, height);
            break;
          case "graphics":
            element = this.add.graphics();
            //设置填充颜色和透明度
            if (width && height) {
              //矩形填充颜色
              element.fillStyle(fillColor, fillAlpha);
              //绘制
              element.fillRoundedRect(x + borderWidth, y + borderWidth, width, height, radius);
            }
            //设置边框颜色和透明度，因为边框有兼容问题，部分android机器会有黑线，废弃
            // if (borderColor) {
            //   //边框宽度 和 填充颜色
            //   element.lineStyle(borderWidth, borderColor, borderColorAlpha);
            //   //  32px 圆角
            //   element.strokeRoundedRect(x, y, width + borderWidth * 2, height + borderWidth * 2, radius * 2);
            // }
            break;
          case "text":
            if (text || text == "") {
              // console.log("textStyle ===>", textStyle);

              element = this.add.text(x, y, text, textStyle);

              if (lineSpacing) {
                element.setLineSpacing(lineSpacing);
              }
              if (wrapWidth) {
                element.setWordWrapWidth(wrapWidth, true);
              }
              if (fontSize) {
                element.setFontSize(fontSize);
              }
              if (fontFamily) {
                element.setFontFamily(fontFamily);
              }
            }
            break;
          default:
            break;
        }
        //switch end

        if (element) {
          //设置名称
          element["name"] = name;

          //透明度
          element.setAlpha(alpha);

          //层级
          depth && element.setDepth(depth);

          //设置origin container没有origin
          if ((origin === 0 || origin === 0.5 || origin === 1) && element["setOrigin"]) {
            element["setOrigin"](origin);
          }

          if (interactive) {
            //设置是否交互
            element.setInteractive();
            if (interactiveArea) {
              //设置交互区域
              element.setInteractive(interactiveArea, Phaser.Geom.Rectangle.Contains);
            }
          }

          if (scale && element.setScale) {
            //设置是否缩放
            element.setScale(scale);
          }

          if (visible === false) {
            //设置是否可见
            element.setVisible(!1);
          } else {
            element.setVisible(!0);
          }
        }
      }
      //for end

      /* 处理父级 */
      this.parseParentSeries(els);
    } else {
      console.warn("No available elementList found");
    }
  }

  /**
   * 通过名称获取元素对象
   *
   * @param scene - [Phaser.Scene]
   * @param name - [string]
   * @returns result - [PhaserGameElement | Phaser.GameObjects.GameObject]
   */
  getElementByName(name: string): PhaserGameElement | Phaser.GameObjects.GameObject {
    /* 场景 */
    // const sc = scene;
    const children = this.children.list;
    let result = null;

    if (children.length > 0) {
      result = this.findEle(name, children);
    }
    return result;
  }

  /**
   * 查找元素
   *
   * @param name - 要找的元素名称 string
   * @param children - 子元素集合 Phaser.GameObjects.GameObject[]
   * @returns any
   */
  findEle(name: string, children: Phaser.GameObjects.GameObject[]): any {
    let result = null;
    for (const v of children) {
      const _name = v.name;
      if (name == _name) {
        result = v;
        break;
      } else if (v["list"] && v["list"].length > 0) {
        result = this.findEle(name, v["list"]);
        if (result && result.name == name) break;
      }
    }
    return result;
  }

  /**
   * 整理层级，把有父级的放入父级内部
   *
   * @param scene - [Phaser.Scene]
   * @param elementList - [Array<elementConfigData>]
   */
  parseParentSeries(elementList: Array<elementConfigData>): void {
    /* 要渲染的元素列表 */
    const els = elementList;

    if (els.length > 0) {
      for (let i = 0; i < els.length; i++) {
        const v = els[i];

        const parentName = v.parentName;
        if (parentName) {
          const targetParent = this.getElementByName(parentName);
          const target = this.getElementByName(v.name);
          targetParent && targetParent["add"](target);
        }
      }
    }
  }
}
```

### 转场场景

transitionScene.ts

```javascript
/* 转场效果场景 */
import { BeeScene } from "@script/plugins/phaserScenePlug";
export class TransitionScene extends BeeScene {
  constructor() {
    super({
      key: "TransitionScene",
      visible: !1,
    });
  }

  //预加载游戏资源
  preload(): void {
    console.log("TransitionScene preload ===>", 22);
  }

  create(): void {
    console.log("TransitionScene ===>", this);
    /* 绘制内容 */
    const cw = +this.game.config.width;
    const ch = +this.game.config.height;

    /* 绘制内容配置 */
    const elist = [
      //左边云
      {
        name: "tran_left",
        type: "image",
        imageName: "tran_left",
        interactive: true,
        x: -cw,
        y: ch / 2,
        depth: 4,
      },
      //右边云
      {
        name: "tran_right",
        type: "image",
        imageName: "tran_right",
        interactive: true,
        x: cw * 2,
        y: ch / 2,
        depth: 3,
      },
    ];

    /* 渲染元素 */
    this.renderElement(elist);
    this.show();
  }
  /* 显示转场 */
  show(): void {
    const lc = this.getElementByName("tran_left");
    const rc = this.getElementByName("tran_right");
    const cw = +this.game.config.width;

    this.tweens.add({
      targets: lc,
      x: cw / 2 - 270,
      duration: 300,
      hold: 500,
      yoyo: true,
    });

    this.tweens.add({
      targets: rc,
      x: cw / 2 + 320,
      duration: 300,
      hold: 500,
      yoyo: true,
    });

    setTimeout(() => {
      this.scene.setActive(!1);
    }, 2500);
  }

  /* update(time: number, delta: number): void {
    console.log("TransitionScene update ===>", time);
  } */
}
```

### layer
```javascript
/* layer 加图片 */
const layer = this.add.layer();
layer.add(this.make.image({ x: 400, y: 300, key: "chapter1_float01" }, false));

/* layer 加spirit */
this.load.image('spaceman', 'assets/sprites/exocet_spaceman.png');
const layer = this.add.layer();
layer.add(this.make.sprite({ x: 150, y: 300, key: 'spaceman'}, false));
```

### 屏幕抖动
```javascript
this.cameras.main.shake(600, 0.001);
```

### 相机镜头缩放移动
```javascript
const cam = this.cameras.main;
cam.pan(15, 55, 30000, "Power2"); //指定移动位置，时间
cam.zoomTo(10, 35000); //指定缩放大小，时间
```

### 获取可视区域的4个端点
```javascript
//获取可视区域的4个端点
getViewOriginPointer(): Record<string, unknown> {
  const viewWidth = document.body.clientWidth;
  const viewHeight = document.body.clientHeight;
  const viewRatio = viewWidth / viewHeight;
  const designWidth = 750;
  const designHeight = 1624;
  const designRatio = designWidth / designHeight;
  // const DPI = window.devicePixelRatio;
  let a: Record<string, number>;
  let b: Record<string, number>;
  let c: Record<string, number>;
  let d: Record<string, number>;
  if (viewRatio > designRatio) {
    console.log("同步宽度");
    //同步宽度
    const viewRatioHeight = (viewHeight / viewWidth) * designWidth;
    const y1 = (designHeight - viewRatioHeight) / 2;
    const y2 = viewRatioHeight + y1;
    a = { x: 0, y: ~~y1 };
    b = { x: designWidth, y: ~~y1 };
    c = { x: 0, y: ~~y2 };
    d = { x: designWidth, y: ~~y2 };
  } else if (viewRatio < designRatio) {
    console.log("同步高度");
    //同步高度
    const viewRatioWidth = (viewWidth / viewHeight) * designHeight;
    const x1 = (designWidth - viewRatioWidth) / 2;
    const x2 = viewRatioWidth + x1;
    a = { x: ~~x1, y: 0 };
    b = { x: ~~x2, y: 0 };
    c = { x: ~~x1, y: designHeight };
    d = { x: ~~x2, y: designHeight };
  } else {
    // 正好的尺寸
    a = { x: 0, y: 0 };
    b = { x: designWidth, y: 0 };
    c = { x: 0, y: designHeight };
    d = { x: designWidth, y: designHeight };
  }
  const viewOriginPoint = { a, b, c, d };

  /* 绘制有效区域标记点 */
  /* const graphics = this.add.graphics();
  //矩形填充颜色
  graphics.fillStyle(0xf3f3f3, 1);
  //6px 圆角
  graphics.fillRoundedRect(0, 0, 10, 10, 2);
  graphics.fillRoundedRect(a.x - 10, a.y - 10, 20, 20, 6);
  graphics.fillRoundedRect(b.x - 10, b.y - 10, 20, 20, 6);
  graphics.fillRoundedRect(c.x - 10, c.y - 10, 20, 20, 6);
  graphics.fillRoundedRect(d.x - 10, d.y - 10, 20, 20, 6); */

  this.registry.set("viewOriginPoint", viewOriginPoint);
  console.log("abcd point=>", viewOriginPoint);

  /* 项目中获取可视区域原点，设置显示内容区域 */
  // this.viewOriginPoint = this.registry.get("viewOriginPoint");

  return viewOriginPoint;
}
```