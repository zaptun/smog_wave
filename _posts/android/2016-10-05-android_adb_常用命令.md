---
layout: post
filename: 2016-10-05-android_adb_常用命令
title: android_adb_常用命令
date: 2016-10-05 10:03:51 +0800
categories: Android
tags: android adb
---

### 获取序列号

```shell
adb get-serialno
```

### 重启机器

```shell
adb reboot
```

### 重启到bootloader，即刷机模式

```shell
adb reboot bootloader
```

### 重启到recovery，即恢复模式

```shell
adb reboot recovery
```

### 重启到recovery，即恢复模式

```shell
adb reboot recovery
```

### 查看app包名

```shell
#进入android操作系统
adb shell
# 在root@android:/# 后边，输入
cd data/data
#然后输入
ls
```

### 启动android 应用程序

```shell
adb shell am start -n 包名/Activity类的类名

eg: adb shell am start -n cn.com.conversant.swiftsync.android/cn.com.conversant.swiftsync.android.main.SplashActivity
```

### 停止 android 应用程序

```shell
adb shell am force-stop 为包名

eg: adb shell am force-stop cn.com.conversant.swiftsync.android
```

### 删除sdcard文件夹

```shell
adb shell rm -fr /mnt/sdcard/dis/
#如果删除失败，用sudo su*先获取权限
sudo su
```

### 清除应用缓存

```shell
adb shell pm clear 包名
eg: adb shell pm clear com.example.browserapp
```

### 复制文件／文件夹到sdcard

```shell
adb push srcPath targetPath
eg: adb push /xxx/html/temp /mnt/sdcard/xxx/
```

### 下拉sdcard文件／文件夹到本地

```shell
adb pull srcPath targetPath
eg: adb pull /mnt/sdcard/xxx/ /xxx/html/temp 
```


### 查看log：

```shell
adb logcat
```

### 终止adb服务进程：

```shell
adb kill-server
```

### 重启adb服务进程：

```shell
adb start-server
```


### 获取机器MAC地址：

```shell
adb shell  cat /sys/class/net/wlan0/address
```

### 获取CPU序列号：

```shell
adb shell cat /proc/cpuinfo
```

### 安装APK：

```shell
adb install <apkfile> //比如：adb install baidu.apk
```

### 保留数据和缓存文件，重新安装apk：

```shell
adb install -r <apkfile> //比如：adb install -r baidu.apk
```

### 安装apk到sd卡：

```shell
adb install -s <apkfile> // 比如：adb install -s baidu.apk
```

### 卸载APK：

```shell
adb uninstall <package> //比如：adb uninstall com.baidu.search
```

### 卸载app但保留数据和缓存文件：

```shell
adb uninstall -k <package> //比如：adb uninstall -k com.baidu.search
```

### 启动应用：

```shell
adb shell am start -n <package_name>/.<activity_class_name>
```


### 查看设备cpu和内存占用情况：

```shell
adb shell top
```

### 查看占用内存前6的app：

```shell
adb shell top -m 6
```

### 刷新一次内存信息，然后返回：

```shell
adb shell top -n 1
```

### 查询各进程内存使用情况：

```shell
adb shell procrank
```

### 杀死一个进程：

```shell
adb shell kill [pid]
```


### 查看进程列表：

```shell
adb shell ps
```

### 查看指定进程状态：

```shell
adb shell ps -x [PID]
```


### 查看后台services信息：

```shell
adb shell service list
```


### 查看当前内存占用：

```shell
adb shell cat /proc/meminfo
```

### 查看IO内存分区：

```shell
adb shell cat /proc/iomem
```

### 将system分区重新挂载为可读写分区：

```shell
adb remount
```

### 从本地复制文件到设备：

```shell
adb push <local> <remote>
```


### 从设备复制文件到本地：

```shell
adb pull <remote> <local>
```


### 列出目录下的文件和文件夹，等同于dos中的dir命令：

```shell
adb shell ls
```

### 进入文件夹，等同于dos中的cd 命令：

```shell
adb shell cd <folder>
```


### 重命名文件：

```shell
adb shell rename path/oldfilename path/newfilename
```


### 删除system/avi.apk：

```shell
adb shell rm /system/avi.apk
```

### 删除文件夹及其下面所有文件：

```shell
adb shell rm -r <folder>
```


### 移动文件：

```shell
adb shell mv path/file newpath/file
```

### 设置文件权限：

```shell
adb shell chmod 777 /system/fonts/DroidSansFallback.ttf
```

### 新建文件夹：

```shell
adb shell mkdir path/foldelname
```

### 查看文件内容：

```shell
adb shell cat <file>
```


### 查看wifi密码：

```shell
adb shell cat /data/misc/wifi/*.conf
```


### 清除log缓存：

```shell
adb logcat -c
```

### 查看bug报告：

```shell
adb bugreport
```

### 获取设备名称：

```shell
adb shell cat /system/build.prop
```

### 查看ADB帮助：

```shell
adb help
```

### 跑monkey：

```shell
adb shell monkey -v -p your.package.name 500
```

