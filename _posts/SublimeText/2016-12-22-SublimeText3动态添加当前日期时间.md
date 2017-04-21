---
layout: post
filename: 2016-12-22-SublimeText3动态添加当前日期时间
title: SublimeText3动态添加当前日期时间
date: 2016-12-22 10:32:24 +0800
categories: SublimeText3
tags: SublimeText3
---

1. 先打开 Preferences -> Brose Packages
2. 在里面建立一个文件夹比如zap_sign
3. 在文件夹里面建立两个文件 Default.sublime-keymap, zap_sign.py

#### Default.sublime-keymap 定义快捷键

```
[
    {"keys": ["shift+alt+s"], "command": "zap_sign"},
    {"keys": ["shift+alt+d"], "command": "zap_jekyll_header"}
]
```

#### zap_sign.py 定义脚本用insert_snippet输入到文档

```python
import datetime, getpass
import sublime, sublime_plugin
class ZapSignCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        self.view.run_command("insert_snippet", { "contents": "/*\n* desc: $1\n* author: zhangkaida@cmcm.com\n* date: "+ "%s" %  datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n*/" } )

class ZapJekyllHeaderCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        self.view.run_command("insert_snippet", { "contents": "---\nlayout: $1\nfilename: "+ "%s" %  datetime.datetime.now().strftime("%Y-%m-%d") + "-$2\ntitle: $2\ndate: "+ "%s" %  datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + " +0800\ncategories: $3\ntags: $4\nimg: /images/$5\nexcerpt: $6\n---" } )

class AddDateCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        self.view.run_command("insert_snippet", { "contents": "%s" %  datetime.date.today().strftime("%d %B %Y (%A)") } )

class AddTimeCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        self.view.run_command("insert_snippet", { "contents": "%s" %  datetime.datetime.now().strftime("%H:%M") } )
``` 
----

#### 快速添加注释

1. 新建文件 common_head.py (~/Library/Application Support/Sublime Text 3/Packages/User)

```python
import sublime, sublime_plugin
import datetime

class PyHeadCommand(sublime_plugin.TextCommand):
    def run(self, edit):
    self.view.run_command("insert_snippet", {
        "contents": "#!/user/bin python"
        "\n"
        "# -*- coding:utf-8 -*- "
        "\n"
        "'''"
        "\n"
        " @Author:      author"
        "\n"
        " @Email:       xx@xx.com\n"
        " @DateTime:    "
        "%s" % datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n"
        " @Description: Description "
        "\n"#
        " @FileName : "
        "%s" % __file__ + "\n"
        "'''"
        "\n"
    })

class JavaHeadCommand(sublime_plugin.TextCommand):
    def run(self, edit):
    self.view.run_command("insert_snippet", {
            "contents": "/**"
            "\n"
            " * @Author:      author"
            "\n"
            " * @Email:       xx@xx.com\n"
            " * @DateTime:    "
            "%s" % datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n"
            " * @Description: Description "
            "\n"
            " */"
            "\n"
        }

    )
class ShHeadCommand(sublime_plugin.TextCommand):
    def run(self, edit):
    self.view.run_command("insert_snippet", {
        "contents": "#!/bin/sh"
        "\n"
        "# @Author:       author"
        "\n"
        "# @Email:        xx@xx.com\n"
        "# @DateTime:     "
        "%s" % datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n"
        "# @Description:  Description "
        "\n"
    })

```

在 keybind_users 里面添加

```python
{"command":"py_head","keys":["ctrl+shift+p"]}, 
{"command":"java_head","keys":["ctrl+shift+j"]}, 
{"command":"sh_head","keys":["ctrl+shift+s"]}, 
```
