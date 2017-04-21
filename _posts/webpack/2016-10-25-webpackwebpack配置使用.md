---
layout: post
filename: 2016-10-25-webpack配置使用
title: webpack配置使用
date: 2016-10-25 23:03:40 +0800
categories: webpack
tags: webpack
---

>webpack是什么，我就不多介绍了，要用的自然知道。

### 1. package.json文件配置

既然是需要用到的是实际项目的构建，那么必然就要考虑开发环境和生产环境下的配置项了：

package.json 内容如下

    {
      // ...
      "scripts": {
        "start": "open http://localhost:8080 && webpack-dev-server --hot --progress --colors",
        "debug": "rm -rf dist/* && webpack -p --progress --colors",
        "build": "rm -rf dist/* && export NODE_ENV=production && webpack -p --progress --colors",
        "deploy": "NODE_ENV=production webpack -p --config --progress",
        "dist": "NODE_ENV=production webpack --progress --colors"
      },
      // ...
    }

可以在目录下执行

    npm run build
    npm run debug
    npm run dist

常用的项目依赖配置

```javascript
"devDependencies": {
    "babel-core": "^6.5.2",
    "babel-loader": "^6.2.2",
    "babel-plugin-react-transform": "^2.0.0",
    "babel-plugin-transform-object-assign": "^6.5.0",
    "babel-preset-es2015": "^6.5.0",
    "babel-preset-es2016": "^6.11.3",
    "babel-preset-react": "^6.5.0",
    "babel-preset-stage-0": "^6.5.0",
    "css-loader": "^0.23.1",
    "expose-loader": "*",
    "extract-text-webpack-plugin": "*",
    "style-loader": "*",
    "file-loader": "*",
    "url-loader": "*",
    "jshint": "*",
    "jshint-loader": "*",
    "react-transform-hmr": "^1.0.2",
    "react-hot-loader": "^1.3.0",
    "react-kendo": "~0.13.11",
    "webpack": "^1.12.11",
    "webpack-dev-server": "^1.14.1",
    "html-webpack-plugin": "^2.8.2",
    "imagemin-webpack-plugin": "*",
    "imagemin-mozjpeg": "*"
},
"dependencies": {
    "react": "^0.14.7",
    "react-router": "^2.0.0",
    "react-dom": "^0.14.7",
    "react-redux": "^4.2.1",
    "redux": "^3.2.1"
},
```

#### 解释一下:

* build 是在我们开发环境下执行的构建命令;
* debug 也是在开发环境下执行，但是加了webpack最强大的功能－－搭建静态服务器和热插拔功能（这个在后面介绍;
* dist 是项目在要部署到生产环境时打包发布。
dist 里面的NODE_ENV=production是声明了当前执行的环境是production－生产环境

#### 后面跟着几个命令：

* --colors 输出的结果带彩色
* --progress 输出进度显示
* --watch 动态实时监测依赖文件变化并且更新
* --hot 是热插拔
* --display-error-details 错误的时候显示更多详细错误信息
* --display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块
* -w 动态实时监测依赖文件变化并且更新
* -d 提供sorcemap
* -p 对打包文件进行压

### 2. 一般项目结构

    ├── app               #开发目录
    |  ├──assets          #存放静态资源
    |  |  ├──data         #存放数据 json 文件
    |  |  ├──img          #存放图片资源文件
    |  |  └──css          #存放样式文件
    |  |
    |  ├──views               #入口文件
    |  |   ├──index.html      #html文件
    |  |   └──index2.js
    |  |
    |  └──components          #存放项目内通用模块组件文件
    |   └──header
    |       ├──header.jsx     #通用头
    |       └──header.css
    |  
    ├──lib
    |  ├──components          #存放跨项目通用模块组件文件
    |  |  └──tab
    |  |      ├──tab.jsx
    |  |      └──tab.css
    |  |     
    |  └──utils               #存放utils工具函数文件
    |  
    ├── dist                  #发布目录
    ├── node_modules          #包文件夹
    ├── .gitignore   
    ├── .jshintrc     
    ├── webpack.config.js  #webpack配置文件
    └── package.json

## 3. webpack.config文件配置

### 3.1 引入依赖包+判断是否是在当前生产环境

引入包

```javascript
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

//声明文件路径
var ROOT_PATH = path.resolve(__dirname);
var SRC_PATH = path.resolve(ROOT_PATH, 'app');                  // 入口目录
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');               // 输出目录 
var MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');     // node模块目录  

//插件
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var imageminMozjpeg = require('imagemin-mozjpeg');
var ImageminPlugin = require('imagemin-webpack-plugin').default;
```

判断生产环境

```javascript
var isProduction = process.env.NODE_ENV === 'production' ? !0 : !1;
```

时间戳

```javascript
//时间戳
var timemark = ((new Date()).toLocaleDateString().replace(/\/|\-/g,'') + (new Date()).getSeconds()).slice(2);
```

### 3.2 插件配置

```javascript
//插件配置
var plugins = [
        //报错但不退出webpack进程
        new webpack.NoErrorsPlugin(),

        //代码热替换   
        new webpack.HotModuleReplacementPlugin(),
        // 分离css
        new ExtractTextPlugin("css/[name].css", { allChunks: true }),
       
        //把入口文件里面的数组打包成common.js
        new webpack.optimize.CommonsChunkPlugin('common', isProduction ? 'common'+timemark+'.js' : 'common.js'),

        // 全局变量插入到所有的代码中
        new webpack.ProvidePlugin({
            "React": "react",
            "ReactDOM": "react-dom",
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery"
        })
    ];

//发布时用uglifyJs压缩你的js代码
isProduction && plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    // sourceMap: false,
    // mangle: false,
    output: {
        comments: false
    }
}));

//发布时压缩图片
isProduction && plugins.push(
    new ImageminPlugin({
        disable: false,
        optipng: {
            optimizationLevel: 3
        },
        gifsicle: {
            optimizationLevel: 1
        },
        jpegtran: {
            progressive: false
        },
        svgo: {},
        pngquant: {
            quality: '60-80'
        },
        plugins: [
            imageminMozjpeg({
                quality: 60
            })
        ]
    })
);

// 设置生产环境
isProduction && plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
);
```

#### CommonsChunkPlugin

CommonsChunkPlugin插件可以打包所有文件的共用部分生产一个commons.js文件,也可以用**chunks**和**excludeChunks**来配置包含/不包含指定模块

```javascript
new webpack.optimize.CommonsChunkPlugin({ 
  name: "common", 
  filename: "js/common.js", 
  chunks: ['index', 'detail']
}),
```

### 3.3 多个入口文件

>入口可以是js文件，利用插件*html-webpack-plugin*动态生成html

#### 自动遍历

```javascript
//多个入口文件处理
var entris = fs.readdirSync(SRC_PATH+'/views/').reduce(function(o, filename) {
    if ( /\.js/g.test(filename) ) {
        var _name = filename.replace(/\.js$|\.jsx$/g,'');
       o[_name] = SRC_PATH+'/views/'+filename;
       //生成html
       var html = new HtmlwebpackPlugin({   
            title: _name,
            filename: _name + '.html',
            chunks: ["common", _name],
            minify: {
                ignoreCustomComments: false,
                minifyCSS: true,
                minifyJS: true,
                keepClosingSlash: true,
                removeEmptyElements: false,
                removeIgnored: true,
                removeOptionalTags: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true,
                removeEmptyAttributes: true,
                useShortDoctype: true,
                preventAttributesEscaping: true,
                removeRedundantAttributes: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeCommentsFromCDATA: true,
                removeCDATASectionsFromCDATA: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
            }
        });
        plugins.push(html);
        //生成html end
    }
    o['common'] = ['react', 'react-dom', 'jquery'];
    return o;
}, {});
```

#### html-webpack-plugin使用例子

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');
plugins.push(new HtmlWebpackPlugin({
    title: 'index',
    filename: outputDir + '/index.html',   //生成html的位置 
    template:'header.html',                //模板
    favicon:'./images/favico.ico',
    minify:true,
    hash:true,
    cache:false,
    showErrors:false,
    inject: 'body',                        //插入script在body标签里
    chunks: ['app'],                       //仅使用app作为注入的文件
    excludeChunks: ['dev-helper']          //不使用dev-helper作为注入文件
}));
```

>html-webpack-plugin 更多配置介绍：[html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)

### 3.2 config的具体配置

>建立config对象配置参数，最后export这个config对象，就是webpack的最终配置

#### Webpack的配置主要为了这几大项目：

* entry：js入口源文件
* output：生成文件
* module：进行字符串的处理
* resolve：文件路径的指向
* plugins：插件，比loader更强大，能使用更多webpack的api

#### 常用Loaders

* 处理样式，转成css，如：less-loader, sass-loader
* 图片处理，如: url-loader, file-loader。两个都必须用上。否则超过大小限制的图片无法生成到目标文件夹中
* 处理js，将es6或更高级的代码转成es5的代码。如： babel-loader，babel-preset-es2015，babel-preset-react
* 将js模块暴露到全局，如果expose-loader

#### 常用Plugins介绍

* 代码热替换, HotModuleReplacementPlugin
* 生成html文件，HtmlWebpackPlugin
* 将css成生文件，而非内联，ExtractTextPlugin(extract-text-webpack-plugin)
* 报错但不退出webpack进程，NoErrorsPlugin
* 代码丑化，UglifyJsPlugin，开发过程中不建议打开
* 多个 html共用一个js文件(chunk)，可用CommonsChunkPlugin
* 清理文件夹，Clean
* 调用模块的别名ProvidePlugin，例如想在js中用$，如果通过webpack加载，需要将$与jQuery对应起来

```javascript
//总体配置
var config = {
    target: 'web',
    cache: true,
    entry: entris,
    devtool: isProduction ? !1 : 'source-map',
    //输出的文件名 合并以后的js会命名为bundle.js
    output: {
        path: BUILD_PATH,
        // 用一个数组[name]来代替，他会根据entry的入口文件名称生成多个js文件，如果要用hash配置成如下
        // filename: '[name].[hash].js'
        filename: isProduction ? 'js/[name]'+timemark+'.js' : 'js/[name].js',
        // publicPath: isProduction ? 'http://******' : 'http://localhost:3000',
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        // 用于转发api数据，但webpack自己提供的并不太好用
        proxy: {
            '/api/*': {
                target: 'http://localhost:3000',
                secure: false
            }
        }
    },
    // externals: {
    //     // 单独外包引入react
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
    resolve: {
        extensions: ['', '.js', '.json'],
        alias: {
            'react': path.resolve(ROOT_PATH, '/lib/utils/react.min'),
            'react-dom': path.resolve(ROOT_PATH, '/lib/utils/react-dom.min'),
            'autoScale': path.resolve(ROOT_PATH, '/lib/utils/_autoScale'),
            'jquery': path.resolve(ROOT_PATH, '/lib/utils/jquery-1.10.1.min')
        }
    },
    jshint: {
        "esnext": true
    },
    module: {
        noParse: [ "react", "react-dom", "jquery"],
        perLoaders: [{
            test: /\.jsx?$/,
            include: SRC_PATH,
            loader: 'jshint-loader'
        }],
        //加载器配置
        loaders: [{
            test: /\.js$/,
            include: SRC_PATH,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['es2015', 'es2016', 'stage-0', 'react'],
                plugins: ['transform-object-assign']
            }
        }, {
            test: /\.(png|jpeg|jpg|gif)$/,
            loader: 'url-loader?limit=20000&name=img/[name].[ext]',
        }, {
            test: /\.styl$/,
            loader: ExtractTextPlugin.extract('css??sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!stylus', {
                publicPath: '../'
            }),
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css?includePaths[]=', {
                publicPath: '../'
            })
        }, {
            test: /\.jsx?$/,
            loader: 'babel',
            include: SRC_PATH,
            query: {
                presets: ['react', 'es2015', 'es2016', 'stage-0']
            }
        },
        // 利用expose?把jQuery,React,ReactDom暴露到global下
        { 
            test: path.join(ROOT_PATH, 'lib/utils/jquery-1.10.1.min'), 
            loader: 'expose?$' 
        },
        { 
            test: path.join(ROOT_PATH, 'lib/utils/react.min'), 
            loader: 'expose?React' 
        },
        { 
            test: path.join(ROOT_PATH, 'lib/utils/react-dom.min'), 
            loader: 'expose?ReactDOM' 
        }]
    },
    plugins: plugins
};

module.exports = config;
```

#### devtool

```javascript
devtool: isProduction ? !1 : 'source-map',
```

规定了在开发环境下才使用 source-map

#### noParse忽略对已知文件的解析

在Webpack中忽略对已知文件的解析,module.noParse 是 webpack 的另一个很有用的配置项，如果你 确定一个模块中没有其它新的依赖 就可以配置这项，webpack 将不再扫描这个文件中的依赖

```javascript
noParse: [ "react", "react-dom", "jquery"],
```

#### resolve

1.extensions 配置是可以忽略的文件后缀名，比如可以直接require('Header');而不用加.jsx
2.alias别名,它的作用是把用户的一个请求重定向到另一个路径,对一些经常要被import或者require的库最好可以直接指定它们的位置,这样webpack可以省下不少搜索硬盘的时间

```javascript
resolve: {
    extensions: ['', '.js', '.json'],
    alias: {
        'react': path.join(ROOT_PATH, 'lib/utils/react.min'),
        'react-dom': path.join(ROOT_PATH, 'lib/utils/react-dom.min'),
        'autoScale': path.join(ROOT_PATH, 'lib/utils/_autoScale'),
        'jquery': path.join(ROOT_PATH, 'lib/utils/jquery-1.10.1.min')
    }
}
```

#### 将模块暴露到全局

如果想将组件放到全局，有两种办法：

1.用expose将对象(例如report)暴露到全局，然后就可以直接使用report进行上报

```javascript
{
    test: path.join(config.path.src, '/js/common/report'),
    loader: 'expose?report'
}
```

2.用ProvidePlugin插件，用R直接代表report

```javascript
new webpack.ProvidePlugin({ "R": "report", }),
```

#### externals使用外部依赖

externals声明一个外部依赖

```javascript
externals: {
   // 单独外包引入react
   "react": "React",
   "react-dom": "ReactDOM"
},
```

当然了 HTML 代码里需要加上这些依赖的script

```html
<script src="https://npmcdn.com/react@15.3.1/dist/react.min.js"></script>
<script src="https://npmcdn.com/react-dom@15.3.1/dist/react-dom.min.js"></script>
```

### 打出独立的css文件和路径问题

使用webpack require css的方法，默认会把css 打入到js文件中，加载顺序有问题，如果需要打出独立的css文件如下方法：

```javascript
//引入插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");

//config的module中的loaders加载器中加一条配置  publicPath部分就是处理路径错误问题
{
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('css?includePaths[]=', {
        publicPath: '../'
    })
}

//最后plugins添加分类css
new ExtractTextPlugin("css/[name].css", { allChunks: true }),

```

### 指定img文件输出到指定文件夹

```javascript
//config的module中的loaders加载器中加一条配置  
//img是指定要存放图片的文件夹名 
//limit是大小限制，小于2000的直接转为base64 
{
    test: /\.(png|jpeg|jpg|gif)$/,
    loader: 'url-loader?limit=20000&name=img/[name].[ext]',
},
```

----

### 一份webpack.config.js配置

```javascript
'use strict';
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

//声明文件路径
var ROOT_PATH = path.resolve(__dirname);
var SRC_PATH = path.resolve(ROOT_PATH, 'app');                  // 入口目录
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');               // 输出目录 
var MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');     // node模块目录 

//判断生产环境
var isProduction = process.env.NODE_ENV === 'production' ? !0 : !1;

//插件
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var imageminMozjpeg = require('imagemin-mozjpeg');
var ImageminPlugin = require('imagemin-webpack-plugin').default;

//时间戳
var timemark = ((new Date()).toLocaleDateString().replace(/\/|\-/g,'') + (new Date()).getSeconds()).slice(2);

//插件配置
var plugins = [
        //报错但不退出webpack进程
        new webpack.NoErrorsPlugin(),

        //代码热替换   
        new webpack.HotModuleReplacementPlugin(),
        // 分离css
        new ExtractTextPlugin("css/[name].css", { allChunks: true }),
       
        //把入口文件里面的数组打包成common.js
        new webpack.optimize.CommonsChunkPlugin('common', isProduction ? 'common'+timemark+'.js' : 'common.js'),
        
        // 全局变量插入到所有的代码中
        new webpack.ProvidePlugin({
            "React": "react",
            "ReactDOM": "react-dom",
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery"
        })
    ];

//发布时用uglifyJs压缩你的js代码
isProduction && plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    // sourceMap: false,
    // mangle: false,
    output: {
        comments: false
    }
}));

//发布时压缩图片
isProduction && plugins.push(
    new ImageminPlugin({
        disable: false,
        optipng: {
            optimizationLevel: 3
        },
        gifsicle: {
            optimizationLevel: 1
        },
        jpegtran: {
            progressive: false
        },
        svgo: {},
        pngquant: {
            quality: '60'
        },
        plugins: [
            imageminMozjpeg({
                quality: 60
            })
        ]
    })
);

// 设置生产环境
isProduction && plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
);


//多个入口文件处理
var entris = fs.readdirSync(SRC_PATH+'/views/').reduce(function(o, filename) {
    if ( /\.js/g.test(filename) ) {
        var _name = filename.replace(/\.js$|\.jsx$/g,'');
       o[_name] = SRC_PATH+'/views/'+filename;
       //生成html
       var html = new HtmlwebpackPlugin({   
            title: _name,
            filename: _name + '.html',
            chunks: ["common", _name],
            minify: {
                ignoreCustomComments: false,
                minifyCSS: true,
                minifyJS: true,
                keepClosingSlash: true,
                removeEmptyElements: false,
                removeIgnored: true,
                removeOptionalTags: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true,
                removeEmptyAttributes: true,
                useShortDoctype: true,
                preventAttributesEscaping: true,
                removeRedundantAttributes: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeCommentsFromCDATA: true,
                removeCDATASectionsFromCDATA: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
            }
        });
        plugins.push(html);
        //生成html end
    }
    o['common'] = ['react', 'react-dom', 'jquery'];
    return o;
}, {});

//总体配置
var config = {
    target: 'web',
    cache: true,
    entry: entris,
    devtool: isProduction ? !1 : 'source-map',
    //输出的文件名 合并以后的js会命名为bundle.js
    output: {
        path: BUILD_PATH,
        // 用一个数组[name]来代替，他会根据entry的入口文件名称生成多个js文件，如果要用hash配置成如下
        // filename: '[name].[hash].js'
        filename: isProduction ? 'js/[name]'+timemark+'.js' : 'js/[name].js',
        // publicPath: isProduction ? 'http://******' : 'http://localhost:3000',
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        // 用于转发api数据，但webpack自己提供的并不太好用
        proxy: {
            '/api/*': {
                target: 'http://localhost:3000',
                secure: false
            }
        }
    },
    // externals: {
    //     // 单独外包引入react
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
    resolve: {
        extensions: ['', '.js', '.json'],
        alias: {
            'react': path.resolve(ROOT_PATH, '/lib/utils/react.min'),
            'react-dom': path.resolve(ROOT_PATH, '/lib/utils/react-dom.min'),
            'autoScale': path.resolve(ROOT_PATH, '/lib/utils/_autoScale'),
            'jquery': path.resolve(ROOT_PATH, '/lib/utils/jquery-1.10.1.min')
        }
    },
    jshint: {
        "esnext": true
    },
    module: {
        noParse: [ "react", "react-dom", "jquery"],
        perLoaders: [{
            test: /\.jsx?$/,
            include: SRC_PATH,
            loader: 'jshint-loader'
        }],
        //加载器配置
        loaders: [{
            test: /\.js$/,
            include: SRC_PATH,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['es2015', 'es2016', 'stage-0', 'react'],
                plugins: ['transform-object-assign']
            }
        }, {
            test: /\.(png|jpeg|jpg|gif)$/,
            loader: 'url-loader?limit=20000&name=img/[name].[ext]',
        }, {
            test: /\.styl$/,
            loader: ExtractTextPlugin.extract('css??sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!stylus', {
                publicPath: '../'
            }),
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css?includePaths[]=', {
                publicPath: '../'
            })
        }, {
            test: /\.jsx?$/,
            loader: 'babel',
            include: SRC_PATH,
            query: {
                presets: ['react', 'es2015', 'es2016', 'stage-0']
            }
        },
        // 利用expose?把jQuery,React,ReactDom暴露到global下
        { 
            test: path.join(ROOT_PATH, 'lib/utils/jquery-1.10.1.min'), 
            loader: 'expose?$' 
        },
        { 
            test: path.join(ROOT_PATH, 'lib/utils/react.min'), 
            loader: 'expose?React' 
        },
        { 
            test: path.join(ROOT_PATH, 'lib/utils/react-dom.min'), 
            loader: 'expose?ReactDOM' 
        }]
    },
    plugins: plugins
};

module.exports = config;
```