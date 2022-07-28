## Electron工程用godaddy证书签名打包

### 1. 构建配置package.json

#### 1.1 主要利用`electron-builder`打包，在`package.json`内配置指向配置文件`builder.yml`。

```shell
"buildapp": "cross-env NODE_ENV=production SERVER_TARGET='' electron-builder --mac --config scripts/builder.yml",
"buildapp:win": "cross-env NODE_ENV=production SERVER_TARGET='' electron-builder --win --config scripts/builder.yml",
```

#### 1.2 建立`scripts/build/notarize.js`

```javascript
const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }
  const appName = context.packager.appInfo.productFilename;

  const params = {
    appBundleId: "com.zhipin.hi",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: "bosswolf@126.com",
    // appleIdPassword: "mglf-vhsz-tnkv-nxrd",
    appleIdPassword: "Bosswolf123",
  };

  console.log(params);
  return await notarize(params);
};
```

#### 1.3 建立`scripts/build/entitlements.mac.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <!-- 处理库签名报错问题 -->
    <key>com.apple.security.cs.allow-jit</key>
    <true/> 
    <key>com.apple.security.cs.allow-dyld-environment-variables</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
  </dict>
</plist>
```

#### 1.4 建立配置文件`scripts/builder.yml`

```yaml
afterSign: "scripts/build/notarize.js"
appId: "com.zhipin.hi"
productName: "Boss Hi"
copyright: "Copyright © 2019 BOSS直聘"

artifactName: "BossHi${env.SERVER_TARGET}-${arch}-${version}.${ext}"
buildDependenciesFromSource: true
npmRebuild: false
files:
  from: "build/certificate${env.SERVER_TARGET}"
  to: "certificate${env.SERVER_TARGET}"
  filter:
    - "!**/node_modules/@ffmpeg-installer/win32-x64/**.*"
    - "!**/node_modules/@journeyapps/sqlcipher/{src,deps}/**.*"
    - "!**/node_modules/@journeyapps/sqlcipher/{**.md,LICENSE}"
    - "!**/node_modules/@journeyapps/sqlcipher/lib/binding/node-v64-win32-x64/**.*"
    - "!**/node_modules/@journeyapps/sqlcipher/lib/binding/electron-v8.2-win32-ia32/**.*"
    - "!**/node_modules/@journeyapps/sqlcipher/lib/binding/electron-v8.2-win32-x64/**.*"

# https://www.electron.build/configuration/win
win:
  icon: "build/icons/icon.ico"
  publish:
    provider: generic
    url: https://img.bosszhipin.com/v2/upload/bosshi/win/
    channel: "latest"
    useMultipleRangeRequest: true
    publishAutoUpdate: true
  target:
    - target: nsis
      arch:
        - ia32
        # - x64
  # signingHashAlgorithms: ["sha1"]   #去掉双加密 sha256
  # rfc3161TimeStampServer: http://timestamp.comodoca.com/rfc3161 #时间戳服务器
  # timeStampServer: http://timestamp.digicert.com  #时间戳服务器
  extraResources:
    - from: build/win/packages
      to: build/win/packages
  # publisherName: ["北京华品博睿网络技术有限公司"]
  verifyUpdateCodeSignature: false
  requestedExecutionLevel: "asInvoker"   #去掉最高权限申请 requireAdministrator，避免触发禁用拖拽
  # certificateSubjectName: "北京华品博睿网络技术有限公司"
  signAndEditExecutable: true
  signDlls: true

# https://www.electron.build/configuration/mac
mac:
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: "scripts/build/entitlements.mac.plist"
  entitlementsInherit: "scripts/build/entitlements.mac.plist"
  icon: "build/icons/icon.icns"
  category: public.app-category.utilities
  target: ["zip", "dmg"]
  publish:
    provider: generic
    url: https://img.bosszhipin.com/v2/upload/bosshi/mac/
    channel: "latest"
    useMultipleRangeRequest: true
    publishAutoUpdate: true

# https://www.electron.build/configuration/linux
linux:
  icon: "build/icons"

# https://www.electron.build/configuration/nsis
nsis:
  oneClick: false
  perMachine: true
  allowToChangeInstallationDirectory: true
  allowElevation: true
  installerIcon: "build/icons/icon.ico"
  uninstallerIcon: "build/icons/icon.ico"
  installerHeaderIcon: "build/icons/icon.ico"
  createDesktopShortcut: true
  createStartMenuShortcut: true
  shortcutName: "Boss Hi"
  # include: "build/script/installer.nsh"

# https://www.electron.build/configuration/dmg
dmg:
  sign: false
  background: "build/mac/dmg/background.tiff"
  icon: "build/icons/icon.icns"
  iconSize: 88
  iconTextSize: 12
  title: "${productName}"
  contents:
    - x: 410
      y: 150
      type: link
      path: "/Applications"
    - x: 130
      y: 150
      type: file
  window:
    width: 552
    height: 310

extraResources:
  - from: build/icons
    to: build/icons
```

[windows配置参考](https://www.electron.build/configuration/win#WindowsConfiguration-certificateSubjectName)

#### 1.5 package.json参考

```json
{
  "name": "boss-hi",
  "description": "BOSS HI",
  "homepage": "https://hi.zhipin.com",
  "version": "2.3.0",
  "author": {
    "name": "BOSS直聘"
  },
  "private": true,
  "main": "./main.js",
  "scripts": {
    "version": "node scripts/version.js",
    "start": "yarn dll && cross-env NODE_ENV=development SERVER_TARGET=dev electron-webpack dev",
    "start:qa": "cross-env NODE_ENV=development SERVER_TARGET=qa electron-webpack dev",
    "start:pro": "cross-env NODE_ENV=development SERVER_TARGET='' electron-webpack dev",
    "build:mac:pro": "yarn compile && yarn buildapp",
    "build:mac:qa": "yarn compile:qa && yarn buildapp:qa",
    "build:windows:pro": "yarn compile && yarn buildapp:windowns",
    "build:win:pro": "yarn compile && yarn buildapp:win",
    "build:win:qa": "yarn compile:qa && yarn buildapp:win:qa",
    "build:mac:dev": "yarn compile:dev && yarn buildapp:mac:dev",
    "build:win:dev": "yarn compile:dev && yarn buildapp:win:dev",
    "compile": "cross-env NODE_ENV=production env=minify SERVER_TARGET='' electron-webpack",
    "compile:qa": "cross-env NODE_ENV=production env=minify SERVER_TARGET=qa electron-webpack",
    "compile:dev": "cross-env NODE_ENV=production env=minify SERVER_TARGET=dev electron-webpack",
    "buildapp": "cross-env NODE_ENV=production SERVER_TARGET='' CSC_LINK=~/Documents/BossHiCodeSign/mac/boss-hi.p12 WIN_CSC_KEY_PASSWORD='' electron-builder --mac --config scripts/builder.yml",
    "buildapp:qa": "cross-env NODE_ENV=production SERVER_TARGET=qa electron-builder --mac --config scripts/builder-qa.yml",
    "buildapp:win": "cross-env NODE_ENV=production SERVER_TARGET='' WIN_CSC_LINK=~/Documents/BossHiCodeSign/windows/bossHi-win.p12 WIN_CSC_KEY_PASSWORD=boss2020kz electron-builder --win --config scripts/builder.yml",
    "buildapp:windowns": "cross-env NODE_ENV=production SERVER_TARGET='qa' electron-builder --win --config scripts/builder-qa.yml",
    "buildapp:win:qa": "cross-env NODE_ENV=production SERVER_TARGET=qa WIN_CSC_LINK=~/Documents/BossHiCodeSign/windows/bossHi-win.p12 WIN_CSC_KEY_PASSWORD=boss2020kz electron-builder --win --config scripts/builder-qa.yml",
    "buildapp:mac:dev": "cross-env NODE_ENV=production SERVER_TARGET=dev electron-builder --mac --config scripts/builder-dev.yml",
    "buildapp:win:dev": "cross-env NODE_ENV=production SERVER_TARGET=dev electron-builder --win --config scripts/builder-dev.yml",
    "lint": "vue-cli-service lint",
    "format": "prettier --config ./.prettierrc --write -l \"src/**/*.{vue,js,css,less}\"",
    "postinstall-back": "electron-rebuild",
    "postinstall": "node ./scripts/postinstall.js && electron-builder install-app-deps",
    "filenames": "node ./scripts/fileNames.js",
    "buildproto": "pbjs -t json src/assets/lib/chat.proto > src/assets/lib/chat.proto.json",
    "utf8": "chcp 65001",
    "dll": "electron-webpack dll",
    "analyze": "NODE_ENV=production npm_config_report=true yarn compile:qa && yarn buildapp:qa"
  },
  "dependencies": {
    "@fullcalendar/bootstrap": "4.1.0",
    "@fullcalendar/core": "4.1.0",
    "@fullcalendar/daygrid": "4.1.0",
    "@fullcalendar/interaction": "4.1.0",
    "@fullcalendar/list": "4.1.0",
    "@fullcalendar/timegrid": "4.1.0",
    "@fullcalendar/vue": "4.1.1",
    "@journeyapps/sqlcipher": "^4.1.0",
    "address": "^1.1.2",
    "axios": "0.18.0",
    "benz-amr-recorder": "^1.0.13",
    "better-scroll": "^1.15.2",
    "bufferutil": "^4.0.1",
    "case": "^1.6.1",
    "core-js": "^3.6.4",
    "crypto-js": "^3.1.9-1",
    "dayjs": "^1.8.12",
    "deepmerge": "^3.2.0",
    "electron-context-menu": "^0.15.1",
    "electron-store": "^5.1.1",
    "electron-updater": "^4.1.2",
    "electron-vue-windows": "^1.0.39",
    "element-ui": "^2.12.0",
    "getmac": "^1.4.6",
    "html-loader": "0.5.5",
    "log4js": "^6.1.0",
    "mqtt": "^3.0.0",
    "node-wifi": "^2.0.12",
    "perfect-scrollbar": "1.4.0",
    "popper.js": "^1.15.0",
    "protobufjs": "^6.8.8",
    "qs": "^6.6.0",
    "request": "^2.88.0",
    "retry-axios": "^2.1.2",
    "source-map-support": "^0.5.12",
    "svg-sprite-loader": "^4.2.1",
    "utf-8-validate": "^5.0.2",
    "uuid": "^3.3.2",
    "vue": "^2.5.22",
    "vue-cropper": "^0.4.9",
    "vue-router": "^3.0.1",
    "vue-showdown": "^2.4.1",
    "vue-virtual-scroll-list": "^2.2.1",
    "vuedraggable": "^2.23.2",
    "vuex": "^3.1.1"
  },
  "devDependencies": {
    "@babel/register": "^7.0.0",
    "@babel/runtime-corejs3": "^7.9.2",
    "@vue/cli-plugin-babel": "^3.4.0",
    "@vue/cli-plugin-eslint": "^3.4.0",
    "@vue/cli-service": "^3.4.0",
    "@vue/eslint-config-prettier": "^4.0.1",
    "babel-eslint": "^10.0.1",
    "babel-loader": "^8.0.5",
    "clean-webpack-plugin": "^3.0.0",
    "cross-env": "^5.2.0",
    "devtron": "^1.4.0",
    "editions": "^2.1.3",
    "electron": "8.2.2",
    "electron-builder": "^22.3.2",
    "electron-debug": "^3.0.1",
    "electron-notarize": "^0.1.1",
    "electron-packager": "^13.0.1",
    "electron-webpack": "^2.7.4",
    "electron-webpack-eslint": "^4.0.1",
    "electron-webpack-vue": "^2.2.3",
    "eslint": "^5.8.0",
    "eslint-friendly-formatter": "^4.0.1",
    "eslint-plugin-html": "^5.0.3",
    "eslint-plugin-prettier": "^3.1.0",
    "eslint-plugin-vue": "^5.0.0",
    "file-loader": "^5.0.2",
    "happypack": "^5.0.1",
    "less": "^3.0.4",
    "less-loader": "^4.1.0",
    "lint-staged": "^8.1.0",
    "lodash": "^4.17.15",
    "mini-css-extract-plugin": "^0.9.0",
    "node-sass": "^4.12.0",
    "raw-loader": "^1.0.0",
    "sass-loader": "^7.1.0",
    "sass-resources-loader": "^2.0.3",
    "shelljs": "^0.8.3",
    "vue-devtools": "^5.0.0-beta.1",
    "vue-template-compiler": "^2.5.21",
    "webpack": "^4.30.0",
    "webpack-bundle-analyzer": "^3.1.0",
    "webpack-cli": "^3.2.3",
    "webpack-merge": "^4.2.1",
    "yarn-run-all": "^3.1.1"
  },
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.js": [
      "vue-cli-service lint",
      "git add"
    ],
    "*.vue": [
      "vue-cli-service lint",
      "git add"
    ]
  },
  "electronWebpack": {
    "whiteListedModules": [
      "vue-virtual-scroll-list"
    ],
    "main": {
      "extraEntries": {
        "preload": "@/lib/preload.js"
      },
      "webpackConfig": "./scripts/config.new/webpack.electron.main.js"
    },
    "renderer": {
      "webpackConfig": "./scripts/config.new/webpack.electron.renderer.js",
      "dll": [
        "axios",
        "benz-amr-recorder",
        "core-js",
        "crypto-js",
        "dayjs",
        "deepmerge",
        "electron-store",
        "qs",
        "request",
        "source-map-support",
        "uuid",
        "vue",
        "vue-router",
        "vuex"
      ]
    }
  },
  "__npminstall_done": false
}
```

**win 主要参数说明：**

| arch                   | 说明                                                         |
| ---------------------- | ------------------------------------------------------------ |
| arch                   | 代表需要打包的位数，win64代表打包64位的，ia32代表打包32位的，最好分开打包，因为一起打包的话最后出来的包是正常开发包的两倍 |
| signingHashAlgorithms  | 代表加密的方式，一般分为'sha256'与'sha1'两种方式，都进行加密即可 |
| rfc3161TimeStampServer | 代表时间戳,一般使用'http://timestamp.digicert.com'来进行时间戳的覆盖即可 |
| certificateFile        | 证书的地址，必须为pfx格式（如何导出会在第二步的时候进行讲解） |
| certificatePassword    | 证书的私钥密码，这个在配置证书的时候进行设置（第二步进行讲解） |

### 2. 代码签名以及需要的证书

为什么要代码签名？为了能 **正常启动** 和正常的 **升级更新**

> Mac 平台（不光需要签名，还需要公证）
>
> 如果没有代码签名，启动app时，会有安全警告【未知开发者】导致应用无法启动；
>
> 没有公证，会提醒【不确定是否有恶意病毒】也会影响启动
>
> Windows 平台
>
> 如果不签名，一样有安全提醒，也会被杀毒软件报警；

mac平台的签名证书可以通过开发者网站制作生成，windows的签名证书就需要购买，可以从windows官方也可以去第三方平台，目前用的是从[godaddy](https://sg.godaddy.com/zh/web-security/code-signing-certificate)购买的代码签名证书；下面说说两个平台如何制作证书和导入配置；



### 3. [MacOS证书制作生成](https://www.jianshu.com/p/d4d82c1e427f)

1. 登录到开发者网站

2. 选择macOS，打开`Certificates,Identifiers & Profiles`,右上角添加证书

   <img src="./imgs/image-20200501114535096.png" alt="image-20200501114535096" style="zoom: 50%;" />

   <img src="./imgs/image-20200501114403042.png" alt="image-20200501114403042" style="zoom: 50%;" />

   3. 选择苹果ID
   4. 选证书类型
   5. 选要生成的证书
   6. 签署需要CSR文件，创建CSR
   7. 一路下一步，最后下载证书

   > Mac 证书说明
   >
   > Mac Developer - 内部开发证书
   >
   > Mac App Distribution - App Stroe 发布证书
   >
   > Mac Installer Distribution - App Stroe pkg签名证书
   >
   > Developer ID Application - App Stroe 之外发布证书
   >
   > Developer ID Installer - App Stroe 之外pkg发布证书

   Mac App Store

   Developer ID

   我们主要需要的就是「Developer ID Application」这个类型的证书，「Mac Development」只是用于开发的，而前者可以供分发，也就是签名后，别人下载安装，就是来自「被认证的开发者」的应用啦。

   如果是在一个 Team 中，不是个人独立开发者，那么这个「Developer ID Application」证书的申请你是没有权限的，就算你们 Team 的 Agent 设置你为 admin（管理员），你还是没有权限的，因为一个「Developer ID Application」只有一个 Team 的 agent（owner） 才能申请，你需要做的是利用你 Mac 上的钥匙串工具（具体怎么做，google 下就可以了），生成「CertificateSigningRequest」（简称 CSR），然后发给你的 team agent，让他帮你生成证书，发回给你，你再安装到自己机子上，搞定。

#### 3.1 检查可用的代码签名证书

在终端调用

```shell
security find-identity -p codesigning -v
```

来看一下你可用的代码签名证书（Developer ID Application开头的就是）

#### 3.2 [如何导出macOS上生成的证书](https://www.electron.build/code-signing#how-to-export-certificate-on-macos)

> 对于App，需要使用**Developer ID Application**进行签名，否则在第一次打开会提示未知开发者。
>
> 而对于pkg安装包，则要使用**Developer ID Installer**进行签名，否则在安装的时候，会提示未知开发者。on

使用X-code进行mac版本上代码签名：

1. 打开xcode主界面
2. Xcode==>Preferences…
3. Accounts==>Apple IDs==>Manage Certificates…
   如果没有登录的话，先登录Apple ID，注意一定要登录开发者账号。登录成功后再进行Manage Certificates；
4. 添加“+”Developer ID Application,注意一定要添加Developer ID Application到钥匙串中，不要选错了
5. 成功添加到钥匙串我的证书中

经过以上的步骤可以成功添加一个证书到钥匙串中的我的证书中。

**注意：通过钥匙串的方式进行代码签名，进而实现自动更新之后，appId应一致，打包应用后不能随意更改新的appId字段。否则会被认为是两个不同的应用而无法更新。**

### 4. Windows购买三方证书

#### 4.1 前期准备

1. git
2. openssl
3. CA根证书
4. Signtool([Signtool介绍和下载传送门](https://docs.microsoft.com/en-us/windows/desktop/seccrypto/signtool))

#### 4.2 生成CSR

[CSR百度百科传送门](https://baike.baidu.com/item/CSR/5195886)

1. 打开git bash

2. 2.输入命令生成私钥和CSR文件

   ```sh w lsh w
   openssl req -new -SHA256 -newkey rsa:2048 -nodes -keyout private.key -out csrname.csr -subj "/C=CN/ST=Guangdong/L=Shenzhen/O='company_name_en'/OU=IT Dept/CN=domain"
   ```

参数解释：

|     参数     |      样例       | 解释                                |
| :----------: | :-------------: | ----------------------------------- |
|     req      |        -        | PKCS10 X.509证书签名请求（CSR）管理 |
|     -new     |     -SHA256     | 以算法sha256申请                    |
|   -newkey    |    rsa:2048     | 以RAS算法生成2048位私钥             |
|    -nodes    |        -        | 不加密私钥                          |
|   -keyout    |   private.key   | 私钥生成路径                        |
|     -out     |   csrname.csr   | 申请证书路径                        |
|    -subj     |        -        | 申请人基本信息                      |
|      C       |       CN        | GB，国家                            |
|      ST      |    Guangdong    | Test State or Province，省          |
|      L       |    Shenzhen     | Test Locality，地区                 |
|      O       | company_name_en | Organization Name，公司名           |
|      OU      |     IT Dep      | Organizational Unit Name，部门      |
|      CN      |   www.xxx.com   | Common Name，通用名                 |
| emailAddress |        -        | 邮箱                                |

#### 4.3 检查是否有以下两个文件

`csrname.csr` 和 `private.key`

#### 4.4 购买证书

[godaddy官网传送门](https://sg.godaddy.com/zh/offers/domains/godaddy-b/cnfos)

以下步骤按照官网提示来即可，如果遇到不懂的，请致电中国客服：400-842-8288（客服小姐姐很用心）：

1. 填写CSR
2. 提交企业认证资料

#### 4.5 下载购买pem证书

认证成功后，进入godaddy产品页，可下载，解压后如下三个文件：

```
18fca4b6bb54298-SHA2.pem
18fca4b6bb54298-SHA2.spc
readme_csds.txt
```

mac系统，打开证书管理，把pem文件安装，添加信任

#### 4.6 生成打包签名用的p12证书

打包时用的是p12/pfx证书，需要转换一下

```shell
//1.可以直接用spc生成 p12
openssl pkcs7 -inform DER -in 18fca4b6bb54298-SHA2.spc -outform PEM -out bosshi.p12

//2.或者生成密匙，然后将pem证书文件转换成p12证书文件
openssl genrsa -des3 -out bosshi-privkey.pem 2048  //生成密钥
openssl pkcs12 -export -in 18fca4b6bb54298-SHA2.pem -out bosshi.p12 -inkey bosshi-privkey.pem

//3.不指定key文件从pem转换p12，生成的p12需要密码
openssl pkcs12 -export -in 18fca4b6bb54298-SHA2.pem -out Cert.p12 -nokeys

//其他命令

//将p12证书文件转换成pem证书文件,提示输入密码，就是p12的导出密码。
openssl pkcs12 -in  Cert.p12 -out Cert.pem -nodes //方法1
openssl pkcs12 -nocerts -nodes -in cert.p12 -out private.pem   //方法2
//验证  
openssl pkcs12 -clcerts -nokeys -in cert.p12 -out cert.pem

//Cer格式文件转化pem
openssl x509 -inform der -in cert.cer -out cert.pem

//从旧P12提取信任私钥
openssl pkcs12 -in old.p12 -nocerts -out privateKey.pem

//从SPC提取文件的证书链
openssl pkcs7 -inform DER -outform PEM -in godaddy.spc -print_certs > certificates.pem

//创建新的P12信任：
openssl pkcs12 -export -out new.p12 -inkey privateKey.pem -in certificates.pem
```



### 5. Code Signing配置

[Code Signing配置官网说明]([https://www.electron.build/code-signing](Code Signing))

> 支持macOS和Windows代码签名。 Windows是双重代码签名的（SHA1和SHA256哈希算法）。
>
> 在macOS开发机器上，将自动使用钥匙串中的有效且适当的身份。

| Env Name - 环境变量         | Description - 说明                                           |
| --------------------------- | ------------------------------------------------------------ |
| CSC_LINK                    | 证书（* .p12或* .pfx文件）的HTTPS链接（或base64编码数据，或file：//链接，或本地路径）。支持简写〜/（主目录）。 |
| CSC_KEY_PASSWORD            | 用于解密CSC_LINK中给出的证书的密码。                         |
| CSC_NAME                    | 仅限macOS的证书名称（用于从login.keychain检索）。如果您有多个身份（否则请不要指定），则对开发机器（而不是CI）有用。 |
| CSC_IDENTITY_AUTO_DISCOVERY | 默认为true-在macOS开发机器上，将自动使用您的钥匙串中的有效身份和适当身份。 |
| CSC_KEYCHAIN                | 钥匙串名称。如果未指定CSC_LINK则使用。默认为系统默认钥匙串。 |

> 注意：
>
> 发布macOS应用还需要 [公证Electron应用](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/) 。
>
> 如果要在macOS上构建Windows，并且需要设置其他证书和密码（与CSC_ * env vars中设置的证书和密码不同），则可以使用WIN_CSC_LINK和WIN_CSC_KEY_PASSWORD。

一般开发时，我们可能会打包测试，这个时候其实不需要签名，如果要[在macOS的构建过程中禁用代码签名](https://www.electron.build/code-signing#how-to-disable-code-signing-during-the-build-process-on-macos)，两种方法：

1. 配置文件`scripts/builder.yml`内配置

```shell
identity: false
```

2. 或者在`package.json`配置**CSC_IDENTITY_AUTO_DISCOVERY**

```shell
"buildapp": "cross-env NODE_ENV=production SERVER_TARGET='' CSC_IDENTITY_AUTO_DISCOVERY=false electron-builder --mac --config scripts/builder.yml",
```



### 6. 在macOS / Linux上签署Windows应用

有两种方法：

1. JSign
2. osslsigncode

[参考原文](https://www.electron.build/tutorials/code-signing-windows-apps-on-unix)

#### 6.1 使用JSign在Mac / Linux上签名Windows应用

此方法需要Java。在尝试此解决方案之前，请确保已安装Java。

1. 通过运行java -v确保已安装Java。
2. [下载JSign](https://ebourg.github.io/jsign/)  [JSign from Github](https://github.com/ebourg/jsign/releases)
3. 创建一个名为`hardwareToken.cfg`的文件。用下面的内容填充它。
4. 检查库链接，以确保您具有正确的[PKCS](https://en.wikipedia.org/wiki/PKCS_11)模块。每个令牌的此链接可能有所不同。在Linux上，您可以在/ lib中找到它，而在Mac上，您可以在/ Library / Frameworks或/ usr / local / lib中找到它。
5. 为Mac安装令牌驱动程序，导出证书（如果证书为.cer，则将其转换为pem）
6. 使用正确的参数运行`java -jar jsign-2.1.jar`。

**hardwareToken.cfg**

```javascript
name = HardwareToken
library = /Library/Frameworks/eToken.framework/Versions/A/libeToken.dylib
slotListIndex = 0
```

URLs: - [JSign from Github](https://github.com/ebourg/jsign/releases)

> libeToken.dylib这个库文件需要安装 EV 代码签名证书工具 SafeNet，安装之后就会有
>
> MAC：[点击下载](https://knowledge.digicert.com/solution/SO20503.html)

Full command for signing:

```shell
java -jar jsign-2.1.jar --keystore hardwareToken.cfg --storepass "your password here" --storetype PKCS11 --tsaurl http://timestamp.digicert.com --alias /link/to/cert.pem
```

#### 6.2 使用osslsigncode在Mac上签名Windows应用

主要问题是在brew中缺少支持OpenSSL 1.1的引擎PKCS 11。当前版本仅支持OpenSSL 1.0。因此，您需要自己编译大多数应用程序。

1. Install some applications with brew like `autoconf`, `automake`, `libtool`, `pkg-config` and `gnu-tar`.
2. Create folder like `/usr/local/mac-dev`, give it rights of your current user, use the folder as a prefix during compilations.
3. Download OpenSSL 1.1.1 tar.gz, see link below, extract and compile: `./config --prefix=/usr/local/mac-dev && make && make install`
4. Export OpenSSL 1.1 variables for compiling the applications below
5. `export LDFLAGS="-L/usr/local/mac-dev/lib"`
6. `export CPPFLAGS="-I/usr/local/mac-dev/include"`
7. `export PATH="/usr/local/mac-dev/bin:$PATH"`
8. `export PKG_CONFIG_PATH="/usr/local/mac-dev/lib/pkgconfig"`
9. Install opensc (.dmg file)
10. Download libp11 .tar.gz, extract and compile: `./configure --prefix=/usr/local/mac-dev && make && make install`
11. Install token driver for Mac, export the certificate (convert it to pem when it is .cer)
12. Download osslsigncode .tar.gz, extract and compile: `./autogen.sh && ./configure --prefix=/usr/local/mac-dev && make && make install` (afterwards symlink the binary to `/usr/local/bin`)
13. Figure out the key ID by running `pkcs11-tool --module /usr/local/lib/libeTPkcs11.dylib -l -O`
14. Run `osslsigncode` with the correct module, engine and key id

URLs: - [OpenSSL 1.1 from their website](https://www.openssl.org/source/) - [OpenSC from Github](https://github.com/OpenSC/OpenSC/releases) - [Libp11 from Github](https://github.com/OpenSC/libp11/releases) - [osslsigncode from Github](https://github.com/mtrojnar/osslsigncode)

Full command for signing, pkcs11module parameter might be different per token.

```shell
osslsigncode sign -verbose -pkcs11engine /usr/local/mac-dev/lib/engines-1.1/libpkcs11.dylib -pkcs11module /usr/local/lib/libeTPkcs11.dylib -h sha256 -n app-name -t https://timestamp.verisign.com/scripts/timestamp.dll -certs /link/to/cert.pem -key 'key-id-here' -pass 'password' -in /link/to/app.exe -out /link/to/app.signed.exe
```

```
brew install autoconf
brew install automake
brew install libtool
brew install pkg-config
brew install gnu-tar
brew install libp11
brew install opensc
brew install osslsigncode
```



### 7. MacOS应用公证

如果没公证，会提示“Apple 无法检查其是否包含恶意软件”，如何公证 Electron App。以下是Electron公证申请指南：

1. 使用`hardened runtime`构建App
2. 使用有效的开发者ID进行签名
3. 使用`electron-notarize`公证App
4. **不要签署你的dmg**



## 踩坑

### 1. windows打包ia32应用

1. **之前一直不成功，因为要electron-builder install-app-deps要指定环境**, 运行这个

   ```shell
   npx electron-builder install-app-deps --platform win32 --arch ia32
   ```

   然后去: /node_modules/@journeyapps/sqlcipher/lib/binding/electron-v8.2-win32-ia32看有木有文件生成

2.  因为最后发现打包出来的安装包太大，应该是包含64和32两个，

   所以在package里面改

   ```javascript
   "postinstall": "node ./scripts/postinstall.js && electron-builder install-app-deps --platform win32 --arch ia32",
   ```

   

### 2. 文字锯齿

font-smoothing这个属性是非标准的CSS定义。它被列入标准规范的草案中，后由于某些原因从web标准中被移除了。但是，我们可以用以下两种定义进行抗锯齿渲染，Webkit在自己的引擎中支持了这一效果

**chrome、safari**

```css
-webkit-font-smoothing: antialiased; 
```

-webkit-font-smoothing

它有三个属性值：

- none —— 对低像素的文本比较好
- subpixel-antialiased——默认值
- antialiased ——抗锯齿很好

例子：body{-webkit-font-smoothing: antialiased;}

这个属性可以使页面上的字体抗锯齿,使用后字体看起来会更清晰。

加上之后就顿时感觉页面小清晰了



**firefox**

```css
-moz-osx-font-smoothing: grayscale;
```

Gecko也推出了自己的抗锯齿效果的非标定义。

-moz-osx-font-smoothing: inherit | grayscale; 这个属性也是更清晰的作用



### 3. windows无法拖拽文件发送

https://github.com/electron/electron/issues/12460. electron文件拖拽这个issue，因为打包申请了最高权限，被系统UAC保护了

 配置文件中

```yaml
requestedExecutionLevel: "requireAdministrator"
```

改成申请普通权限就可以了

```yaml
requestedExecutionLevel: "asInvoker"
```



### 4. mac应用启动报错

启动BossHi报错，签名失败

```shell
Application Specific Information:
dyld: launch, loading dependent libraries

Dyld Error Message:
  Library not loaded: @rpath/Electron Framework.framework/Electron Framework
  Referenced from: /Volumes/*/Boss Hi.app/Contents/MacOS/Boss Hi
  Reason: no suitable image found.  Did find:
 /Volumes/Boss Hi/Boss Hi.app/Contents/MacOS/../Frameworks/Electron Framework.framework/Electron Framework: code signature in (/Volumes/Boss Hi/Boss Hi.app/Contents/MacOS/../Frameworks/Electron Framework.framework/Electron Framework) not valid for use in process using Library Validation: mapped file has no Team ID and is not a platform binary (signed with custom identity or adhoc?)
 /Volumes/Boss Hi/Boss Hi.app/Contents/MacOS/../Frameworks/Electron Framework.framework/Electron Framework: stat() failed with errno=1
```

解决方案：https://github.com/electron-userland/electron-builder/issues/3940

把原来的plist配置文件做个修改调整

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.allow-dyld-environment-variables</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
</dict>
</plist>
```



### 5. EV 代码签名证书工具 SafeNet

- MAC：[点击下载](https://knowledge.digicert.com/solution/SO20503.html)
- Windows：[点击下载](https://download.comodo.com/SAC/win/x64/SafeNetAuthenticationClient-x64-10.3.msi)



### 6. windows包证书签名后安装提醒发布者不正确

一开始以为是签名加密不对，签名证书应该有两种加密sha1，sha2，发现打出来的签名，sha1里面也是256的加密；所以尝试把双签名关闭，改成只签名sha256；

```xml
signingHashAlgorithms: ["sha256"]  #去掉sha1 不打双签名
rfc3161TimeStampServer: "http://timestamp.digicert.com" #字符串-RFC 3161时间戳服务器的URL
```

改完打包发现问题依旧；

最后查windows官方资料，发现是证书问题，必现是**EV**证书，之前购买的是OV证书；



windows有**DV型、OV型、EV型证书的主要区别**，[证书说明参考](https://blog.csdn.net/m0_37941906/article/details/80681168)

**DV和OV型证书**

最大的差别是：DV型证书不包含企业名称信息；而OV型证书包含企业名称信息，以下是两者差别对比表：

|                        | DV             | OV                    |
| ---------------------- | -------------- | --------------------- |
| 包含企业名称信息       | 否             | 是                    |
| 验证公司名称合法性     | 否             | 是                    |
| 通过第三方查询电话验证 | 否             | 是                    |
| 域名验证方式           | 管理员邮箱批准 | 查询whois信息是否一致 |
| 验证时间               | 最快10分钟签发 | 一般2-3天完成签发     |
| 证书可信度             | 低             | 较高                  |

DV和OV型证书在用户查看证书的详情是，OV型证书会在证书的Subject中显示域名+单位名称等信息；DV型证书只会在证书的Subject中显示域名，如下两图：

| DV证书                                                       | OV证书                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![DV证书使用者](file:////Users/admin/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/32946C66-49FB-8247-B830-B68635486DFD.png) | ![OV证书使用者](file:////Users/admin/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/2C7EB23D-2E40-BF4D-AEA2-534E965C09F3.png) |

**OV型和EV型证书的区别**

 OV型和EV型证书，都包含了企业名称等信息，但EV证书因为其采用了更加严格的认证标准，浏览器对EV证书更加“信任”，当浏览器访问到EV证书时，可以在地址栏显示出公司名称，并将地址栏变成绿色。

**如何挑选适合的证书类型**

**如果您**

- 仅需要通过在线加密实现数据安全
- 主要用于电子邮件、IM，CDN加速等
- 用户内部的OA，CRM，VPN系统
- 还是一个初创公司，业务刚刚起步。

我们建议您可以先购买**DV型**证书，提高网站安全性和PR值。

**如果您**

- 面向公众提供服务
- 有用户账户登录，在线应用等
- 有多个应用需求，多个域名需要部署
- 公司已经拥有一定的规模

我们建议您购买**OV型**证书，方便用户快速识别网站真实性，实现全网SSL。

**如果您**

- 需要实现在线交易，在线支付功能
- 有高价值的数据保密需求
- 需要防止可能遇到的钓鱼网站攻击
- 属于大型企业或者金融机构

我们建议您购买**EV型**证书，提供最高安全性，帮助客户选择您的服务。

爱名网是性价比之王，客服妹子服务很不错，有需要可以前往咨询 https://ssl.22.cn

**DV型和OV型证书的区别**

DV和OV型证书最大的差别是：DV型证书不包含企业名称信息；而OV型证书包含企业名称信息，以下是两者差别对比表：

|                        | DV             | OV                    |
| ---------------------- | -------------- | --------------------- |
| 包含企业名称信息       | 否             | 是                    |
| 验证公司名称合法性     | 否             | 是                    |
| 通过第三方查询电话验证 | 否             | 是                    |
| 域名验证方式           | 管理员邮箱批准 | 查询whois信息是否一致 |
| 验证时间               | 最快10分钟签发 | 一般2-3天完成签发     |
| 证书可信度             | 低             | 较高                  |

DV和OV型证书在用户查看证书的详情是，OV型证书会在证书的Subject中显示域名+单位名称等信息；DV型证书只会在证书的Subject中显示域名，如下两图：

| DV证书                                                       | OV证书                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![DV证书使用者](file:////Users/admin/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/32946C66-49FB-8247-B830-B68635486DFD.png) | ![OV证书使用者](file:////Users/admin/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/2C7EB23D-2E40-BF4D-AEA2-534E965C09F3.png) |

**OV型和EV型证书的区别**

 OV型和EV型证书，都包含了企业名称等信息，但EV证书因为其采用了更加严格的认证标准，浏览器对EV证书更加“信任”，当浏览器访问到EV证书时，可以在地址栏显示出公司名称，并将地址栏变成绿色。

**如何挑选适合我的证书类型**

**如果您**

- 仅需要通过在线加密实现数据安全
- 主要用于电子邮件、IM，CDN加速等
- 用户内部的OA，CRM，VPN系统
- 还是一个初创公司，业务刚刚起步。

我们建议您可以先购买**DV型**证书，提高网站安全性和PR值。

**如果您**

- 面向公众提供服务
- 有用户账户登录，在线应用等
- 有多个应用需求，多个域名需要部署
- 公司已经拥有一定的规模

我们建议您购买**OV型**证书，方便用户快速识别网站真实性，实现全网SSL。

**如果您**

- 需要实现在线交易，在线支付功能
- 有高价值的数据保密需求
- 需要防止可能遇到的钓鱼网站攻击
- 属于大型企业或者金融机构

我们建议您购买**EV型**证书，提供最高安全性，帮助客户选择您的服务。



