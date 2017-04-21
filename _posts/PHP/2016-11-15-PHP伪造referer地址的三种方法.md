---
layout: post
filename: 2016-11-15-PHP伪造referer地址的三种方法
title: PHP伪造referer地址的三种方法[转]
date: 2016-11-15 10:26:29 +0800
categories: PHP
tags: 伪造referer
---

### 1. CURL

```php
<?php
$ch = curl_init();  
curl_setopt ($ch, CURLOPT_URL, "http://www.yyyy.com");  
curl_setopt ($ch, CURLOPT_REFERER, "http://www.xxxx.com/");  
curl_exec ($ch);  
curl_close ($ch);
?>
```

### 2. SOCKET

```php
<?php 
$server = 'www.yyyy.com';
$host = 'www.yyyy.com';
$target = 'index.php';
$referer = 'http://www.xxxx.com/'; // Referer
$port = 80;
$fp = fsockopen($server, $port, $errno, $errstr, 30);
if (!$fp){
    echo "$errstr ($errno)\n";
}else{
    $out = "GET $target HTTP/1.1\r\n";
    $out .= "Host: $host\r\n";
    $out .= "Referer: $referer\r\n";
    $out .= "Connection: Close\r\n\r\n";
    fwrite($fp, $out);
    while (!feof($fp)){
        echo fgets($fp, 128);
    }
    fclose($fp);
}
?>
```

### 3. file_get_contents

```php
<?php 
$opt=array('http'=>array('header'=>"Referer: $refer"));
$context=stream_context_create($opt);
$file_contents = file_get_contents($url,false, $context);
?>
```

通过上面的代码，我们就把referer地址伪装为http://www.xxxx.com，你可以写一段代码：
$_SERVER['HTTP_REFERER'];
查看到这个referer地址，就是这么简单，所以referer也不是什么可靠的数据了。
