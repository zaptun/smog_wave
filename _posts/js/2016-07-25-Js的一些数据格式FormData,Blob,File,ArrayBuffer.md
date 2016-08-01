---
layout: post
filename: 2016-07-25-Js的一些数据格式FormData,Blob,File,ArrayBuffer
title: Js的一些数据格式FormData,Blob,File,ArrayBuffer
date: 2016-07-25 11:15:03 +0800
categories: Js
tags: Js数据格式
---

## FormData对象

使用实例：

```javascript
document.querySelector("#formData").addEventListener("submit", function(event) {
    var myFormData = new FormData(this);
    var xhr = new XMLHttpRequest();
    xhr.open(this.method, this.action);
    xhr.onload = function(e) {
        if (xhr.status == 200 && xhr.responseText) {
            // 显示：'欢迎你，' + xhr.responseText;
            this.reset();
        }
    }.bind(this);
    
    //给当前FormData对象添加一个键/值对
    myFormData.append("token", "ce509193050ab9c2b0c518c9cb7d9556");

    // 发送FormData对象数据
    xhr.send(myFormData);
    // 阻止默认的表单提交
    event.preventDefault();
}, false);
```

## Blob数据

以上为MDN上官方口吻的解释。实际上，Blob是计算机界通用术语之一，全称写作：BLOB (binary large object)，表示二进制大对象。MySql/Oracle数据库中，就有一种Blob类型，专门存放二进制数据。

在实际Web应用中，Blob更多是图片二进制形式的上传与下载，虽然其可以实现几乎任意文件的二进制传输。

使用实例：

```javascript
var xhr = new XMLHttpRequest();    
xhr.open("get", "mm1.jpg", true);
xhr.responseType = "blob";
xhr.onload = function() {
    if (this.status == 200) {
        var blob = this.response;  // this.response也就是请求的返回就是Blob对象
        var img = document.createElement("img");
        img.onload = function(e) {
          window.URL.revokeObjectURL(img.src); // 清除释放
        };
        img.src = window.URL.createObjectURL(blob);
        eleAppend.appendChild(img);    
    }
}
xhr.send();
```

Blob对象有两个属性，参见下表：

属性名|类型 | 描述
-|-|-|
size  |  unsigned long long(表示可以很大的数值) | Blob对象中所包含数据的大小。字节为单位。 只读。
type  |  DOMString   |一个字符串，表明该Blob对象所包含数据的MIME类型。例如，上demo图片MIME类似就是”image/jpeg“. 如果类型未知，则该值为空字符串。 只读。

另外Blob也可以用构造函数创建：

```javascript

Blob Blob(
  [可选] Array parts,
  [可选] BlobPropertyBag properties
);

var myBlob= new Blob(arrayBuffer);
```

#### 参数说明：

|-|-|
parts| 一个数组，包含了将要添加到Blob对象中的数据。数组元素可以是任意多个的ArrayBuffer, ArrayBufferView(typed array), Blob, 或者DOMString对象。
properties| 一个对象，设置Blob对象的一些属性。目前仅支持一个type属性，表示Blob的类型。|


### Blob的slice方法：

在传输大文件时，通常用Blob的 **slice** 方法实现文件的分割传输，也就是断点续传。

```javascript
Blob.slice(
    start, //可选 long long start,
    end, //可选 long long end,
    contentType //可选 DOMString contentType
)
```

#### 参数释义：

|-|-|
start| 开始索引，可以为负数，语法类似于数组的slice方法。默认值为0.
end| 结束索引，可以为负数，语法类似于数组的slice方法。默认值为最后一个索引。
contentType| 新的Blob对象的MIME类型，这个值将会成为新的Blob对象的type属性的值，默认为一个空字符串。

显然，此方法返回的数据格式还是Blob对象，不过是指定范围复制的新的Blob对象。注意，如果start参数的值比源Blob对象的size属性值还大，则返回的Blob对象的size值为0，也就是不包含任何数据。

## File对象

File顾名思意就是“文件”，通常而言，表示我们使用file控件( **`<input type="file">`** )选择的FileList对象，或者是使用拖拽操作搞出的[DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer)对象。

这里的File对象也是二进制对象，因此，从属于Blob对象，Blob对象的一些属性与方法，File对象同样适合，且推荐使用Blob对象的属性与方法。

属性(注意：全部是 **只读属性** ):

|-|-|
File.lastModifiedDate |文件对象最后修改的日期
File.name |文件对象的名称
File.name<br> (过时)File.fileName | 文件对象的名称<br>（请使用File.name）
Blob.size<br> (过时)File.fileSize | 文件对象的大小<br>（请使用Blob.size）
Blob.size | Blob对象包含数据的字节大小
Blob.type | 一个字符串，表明该Blob对象所包含数据的MIME类型

方法：

|-|-|
FileReader.readAsBinaryString() <br> (过时)File.getAsBinary() | 二进制形式返回文件数据<br>（请使用FileReader对象的FileReader.readAsBinaryString()方法代替） 
FileReader.readAsDataURL() <br> (过时)File.getAsDataURL() | 返回文件data:URL编码字符串数据<br>（请使用FileReader对象的FileReader.readAsDataURL()方法代替）
FileReader.readAsText() <br> (过时)File.getAsText(string encoding) | 以给定的字符串编码返回文件数据解释后的文本<br>（请使用FileReader对象的FileReader.readAsText()方法代替）
Blob.size[只读] | Blob对象包含数据的字节大小
Blob.type[只读] | 一个字符串，表明该Blob对象所包含数据的MIME类型。

在实际的工作中会遇到这样的需求：将图片转换成Data base64 url格式，这时就可以用FileReader.readAsDataURL()方法（还有就是canvas元素的toDataURL()和toDataURLHD()方法。


## ArrayBuffer对象

>ArrayBuffer表示二进制数据的原始缓冲区，该缓冲区用于存储各种类型化数组的数据。<br>ArrayBuffer是二进制数据通用的固定长度容器。

#### Blob和ArrayBuffer有啥区别呢？

Blob可以append ArrayBuffer数据，也就是Blob是个更高一级的大分类。

ArrayBuffer存在的意义就是作为数据源提前写入在内存中，就是提前钉死在某个区域，长度也固定，万年不变。于是，当我们要处理这个ArrayBuffer中的二进制数据，例如，分别8位，16位，32位转换一遍，这个数据都不会变化，**3种转换共享数据**。

**So，ArrayBuffer就是缓冲出来的打死不动的二进制对象。**

注意，ArrayBuffer本身是不能读写的，需要借助类型化数组或DataView对象来解释原始缓冲区（宰割原始二进制数据）。

### 类型化数组

类型化数组(Typed Arrays)是JavaScript中新出现的一个概念，专为访问原始的二进制数据而生。

类型数组的类型有：

名称  |大小 (以字节为单位)|说明
-|-|
Int8Array |1| 8位有符号整数
Uint8Array |1| 8位无符号整数
Int16Array |2| 16位有符号整数
Uint16Array |2| 16位无符号整数
Int32Array |4| 32位有符号整数
Uint32Array |4| 32位无符号整数
Float32Array |4| 32位浮点数
Float64Array |8| 64位浮点

本质上，类型化数组和ArrayBuffer是一样的。不过一个可读写（脱掉buffer限制），一个当数据源的命。

举一些代码例子，看看本质一致在何处：

```javascript
// 创建一个8字节的ArrayBuffer  
var b = new ArrayBuffer(8);  
  
// 创建一个指向b的视图v1，采用Int32类型，开始于默认的字节索引0，直到缓冲区的末尾  
var v1 = new Int32Array(b);  
  
// 创建一个指向b的视图v2，采用Uint8类型，开始于字节索引2，直到缓冲区的末尾  
var v2 = new Uint8Array(b, 2);  
  
// 创建一个指向b的视图v3，采用Int16类型，开始于字节索引2，长度为2  
var v3 = new Int16Array(b, 2, 2);  
```

上面代码里变量的数据结构如下表所示：

<table width="100%">
<tbody><tr>
<th scope="col">变量</th>
<th colspan="8" scope="col">索引</th>
</tr>
<tr align="center">
<td align="center">&nbsp;</td>
<td colspan="8" align="center">字节（不可索引）</td>
</tr>
<tr>
<td align="center">b=</td>
<td align="center">0</td>
<td align="center">1</td>
<td align="center">2</td>
<td align="center">3</td>
<td align="center">4</td>
<td align="center">5</td>
<td align="center">6</td>
<td align="center">7</td>
</tr>
<tr>
<td align="center">&nbsp;</td>
<td colspan="8" align="center">类型数组</td>
</tr>
<tr>
<td align="center">v1=</td>
<td colspan="4" align="center">0</td>
<td colspan="4" align="center">1</td>
</tr>
<tr>
<td align="center">v2=</td>
<td align="center" bgcolor="#999999" style="background-color:#999;">&nbsp;</td>
<td align="center" bgcolor="#999999" style="background-color:#999;">&nbsp;</td>
<td align="center">0</td>
<td align="center">1</td>
<td align="center">2</td>
<td align="center">3</td>
<td align="center">4</td>
<td align="center">5</td>
</tr>
<tr>
<td align="center">v3=</td>
<td align="center" bgcolor="#999999" style="background-color:#999;">&nbsp;</td>
<td align="center" bgcolor="#999999" style="background-color:#999;">&nbsp;</td>
<td colspan="2" align="center">0</td>
<td colspan="2" align="center">1</td>
<td align="center" bgcolor="#999999" style="background-color:#999;">&nbsp;</td>
<td align="center" bgcolor="#999999" style="background-color:#999;">&nbsp;</td>
</tr>
</tbody></table>

由于类型化数组直接访问固定内存，因此，速度很赞，比传统数组要快！因为普通Javascript数组使用的是Hash查找方式。同时，类型化数组天生处理二进制数据，这对于XMLHttpRequest 2、canvas、webGL等技术有着先天的优势。

### DataView对象（[API参考](http://www.javascripture.com/DataView)）

DataView对象在可以在ArrayBuffer中的任何位置读取和写入不同类型的二进制数据。

用法语法如下：

```javascript
var dataView = new DataView(DataView(buffer, byteOffset[可选], byteLength[可选]));
```

其中，buffer表示ArrayBuffer；byteOffset指缓冲区开始处的偏移量（以字节为单位）；byteLength指缓冲区部分的长度（以字节为单位）。

属性

|-|-|
buffer | 表示ArrayBuffer
byteOffset | 指缓冲区开始处的偏移量
byteLength | 指缓冲区部分的长度

方法还有有很多：

>getInt8, getUint8, getInt16, getUint16, getInt32, getUint32, getFloat32, getFloat64, setInt8, setUint8, setInt16, setUint16, setInt32, setUint32, setFloat32, setFloat64.

下面回到ArrayBuffer对象，ArrayBuffer对象自身也可以构造，跟上面的FormData, Blob对象类似，例如：

```javascript
var buf = new ArrayBuffer(32);  //语法 ArrayBuffer ArrayBuffer(length[可以很大数值]);
```

其有一个byteLength属性，表示ArrayBuffer的长度，也可以说是大小；还有一个slice方法，语法如下：

```javascript
ArrayBuffer slice(
  begin
  end[可选]
);
```

begin表示起始，end表示结束点。据说，Internet Explorer 10 以及iOS6-是没有该方法的。

举个ArrayBuffer的实例，使用XMLhttpRequest发送ArrayBuffer数据：

```javascript
function sendArrayBuffer() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };

  var uInt8Array = new Uint8Array([1, 2, 3]);

  xhr.send(uInt8Array.buffer);
}
```

使用了类型化数组，发送的是类型化数组(uInt8Array)的buffer属性，也就是ArrayBuffer对象。

参考链接：

[DataView](http://www.javascripture.com/DataView)

[MDN DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

[MDN ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

[DataView](http://www.zhangxinxu.com/wordpress/2013/10/understand-domstring-document-formdata-blob-file-arraybuffer/)

