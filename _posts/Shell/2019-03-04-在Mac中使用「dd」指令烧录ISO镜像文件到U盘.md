---
layout: post
filename: 2019-03-04-在Mac中使用「dd」指令烧录ISO镜像文件到U盘
title: 在Mac中使用「dd」指令烧录ISO镜像文件到U盘
date: 2019-03-04 08:47:29 +0800
categories: iso
tags: iso
---

### 在Mac中使用「dd」指令烧录ISO镜像文件到U盘

#### 1.首先我們先打開「終端機」，然後輸入 diskutil list 來查看所有硬碟，從結果中我們可以看到我的USB硬碟的硬碟位置是「/dev/disk2」，並把這個位置牢牢記住

`diskutil list`

```shell
arefly:~ arefly$ diskutil list
/dev/disk0
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *251.0 GB   disk0
   1:                        EFI EFI                     209.7 MB   disk0s1
   2:                  Apple_HFS Macintosh HD            250.1 GB   disk0s2
   3:                 Apple_Boot Recovery HD             650.0 MB   disk0s3
/dev/disk1
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *1.0 TB     disk1
   1:                  Apple_HFS Mac-Arefly              200.2 GB   disk1s1
   2:                  Apple_HFS Mac-Backup              200.2 GB   disk1s2
   3:               Windows_NTFS Arefly-Important        104.9 GB   disk1s3
   4:               Windows_NTFS Arefly-Other            495.0 GB   disk1s4
/dev/disk2
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *4.0 GB     disk2
   1:                       0x17                         1.0 GB     disk2s1
arefly:~ arefly$
```

#### 2.接著取消掛載（並不是彈出！）該磁碟：

>注意：在以下所有步驟之中，你均需「[硬碟位置]」替換為你的磁碟位置（例如「/dev/disk2」等等）！

`diskutil unmountDisk [硬碟位置]`

```shell
arefly:~ arefly$ diskutil unmountDisk [硬碟位置]
Unmount of all volumes on [硬碟位置] was successful
arefly:~ arefly$
```

#### 3.取消掛載完成後，我們就可以來正式寫入該文件了：（此過程耗時較長，請耐心等待！）

>注意：你可以將「/dev/disk2」（僅僅舉例）改為「/dev/rdisk2」以提升寫入速度！

>小技巧：在輸入 [.ISO文件位置] 時，我們可以直接將該文件拖入「終端機」即可！

```shell
arefly:~ arefly$ sudo dd if=[.ISO文件位置] of=[硬碟位置] bs=1m; sync
Password: 【注：這裏輸入的密碼不會顯示在螢幕上！】
980+1 records in
980+1 records out
4111581184 bytes transferred in 407.371084 secs (10092963 bytes/sec)
arefly:~ arefly$
```

#### 4.最後等待燒錄完成後，即可輸入 diskutil eject [硬碟位置] 來彈出你的USB磁碟，現在我們的燒錄工作就完成啦！

```shell
arefly:~ arefly$ diskutil eject [硬碟位置]
Disk [硬碟位置] ejected
arefly:~ arefly$
```