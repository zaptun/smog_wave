---
layout: post
filename: 2016-11-10-find+xargs+sed批量替换文件内容
title: find+xargs+sed批量替换文件内容
date: 2016-11-10 11:51:39 +0800
categories: Shell
tags: sed xargs Shell
---

### 在mac的Terminal上用sed批量替换文件

```shell
#替换所有.html文件，单行替换 把所有的styel='font-size:15pt'的字符串替换为rex
find . -name '*.htm' -print0 | xargs -0 perl -pi -e s/style\=\'font-size:15pt\'/rex/g

#如果报编码bug，先声明LANG，sed 替换单行html为body
export LANG=C && sed -i -n "s/html/body/g" a.html

#直接覆盖不备份(-i ''),注意c\后面要换行替换，否则报错，后面接\表示再换行,最后'结束
find . -name '*.htm' -print0 | xargs -0 sed -i '' '/html/,/body/c\         
<body>\
<div>tets</div>'

#备份为.backup后缀文件(-i ' -i '.backup')
find . -name '*.htm' -print0 | xargs -0 sed -i ' -i '.backup'' '/html/,/body/c\           
dddmd\
fdf'

```   