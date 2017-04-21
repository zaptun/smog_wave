---
layout: post
filename: 2016-11-15-PHP跨域header配置
title: PHP跨域header配置
date: 2016-11-15 13:45:16 +0800
categories: PHP	
tags: 跨域
---

### 允许 a.com发起的跨域请求

```php
<?php 
header('Access-Control-Allow-Origin: a.com');
?>
```

### 允许所有域名发起的跨域请求
```php
<?php 
header('Access-Control-Allow-Origin: *');
?>
```

### 允许白名单跨域

```php
<?php 
$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : '';  
$allow_origin = array(
    'http://client2.youj.com',  
    'http://client3.youj.com'
);  
if(in_array($origin, $allow_origin)){  
   header('Access-Control-Allow-Origin:'.$origin);
}
?>
```