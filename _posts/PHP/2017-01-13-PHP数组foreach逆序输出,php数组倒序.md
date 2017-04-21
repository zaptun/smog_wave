---
layout: post
filename: 2017-01-13-PHP数组foreach逆序输出,php数组倒序
title: PHP数组foreach逆序输出,php数组倒序
date: 2017-01-13 12:49:29 +0800
categories: PHP
tags: PHP 数组
---

简单的一个php数组函数,php数组逆序输出代码

```php
<?php
foreach(array_reverse($array) AS $key=>$value){ 
echo $value.'
'; 
} 
?>
```

### array_reverse

array_reverse — 返回一个单元顺序相反的数组

array array_reverse ( array $array [, bool $preserve_keys ] )

array_reverse() 接受数组 array 作为输入并返回一个单元为相反顺序的新数组，如果 preserve_keys 为 TRUE 则保留原来的键名。

```php
<?php
$input  = array("php", 4.0, array("green", "red"));
$result = array_reverse($input);
$result_keyed = array_reverse($input, TRUE);
?>

//输出显
Array
(
    [0] => Array
        (
            [0] => green
            [1] => red
        )

    [1] => 4
    [2] => php
)
Array
(
    [2] => Array
        (
            [0] => green
            [1] => red
        )

    [1] => 4
    [0] => php
)

```

>Note: 第二个参数是 PHP 4.0.3 中新加的。