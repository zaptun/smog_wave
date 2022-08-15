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

//使用
this.anims.create({
  key: "guideClick",
  frames: "ef-click",
  frameRate: 20,
  repeat: -1,
});

const spriteClick = this.add.sprite(100, 200, "ef-click").play("ruguideClickn");
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

### 调整场景的层级
```javascript
//场景置顶
this.scene.bringToTop();
//场景置底
this.scene.sendToBack();
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
  private effectMusic: Phaser.Sound.BaseSound;
  private musicMark: Array<Record<string, unknown>>;
  private mute: boolean;

  constructor() {
    super({
      key: "LoadingScene",
      visible: !1,
    });
    //初始化配置
  	//...
    this.mute = false;
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
    this.load.audio("bgMusic", "assets/audio/bg.mp3");
    this.load.audio("effect", ["assets/audio/effect.mp3"], {
      instances: 4,
    });
  }

  //暴露播放音乐方法，之后用跨场景调用方法，来播放音效
  playEffect(type: string): void {
    const types = {
      fail: 0,
      defeat: 1,
      right: 2,
      ding: 3,
      allright: 4,
      prize: 5,
      ready: 6,
      oh: 7,
      ondream: 8,
    };
    if (this.mute) return;
    this.sound.play("effect", this.musicMark[types[type]]);
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

```