# image-optimize

[![Build Status](https://www.travis-ci.org/izhangxu/image-optimize.svg?branch=master)](https://www.travis-ci.org/izhangxu/image-optimize)

图片压缩工具，支持CLI及require引入调用

## 简介
- 支持传入文件夹整体压缩
- 支持压缩单独文件
- 支持处理png、jpg、jpeg、gif
- 支持命令行及引入模块调用
- 模块引用返回promise接口

## 安装
``` bash
$ npm install imageoptimize
```

## 版本
node >= 5.2.0

## require引入

### 调用
```
const imageoptimize = require('imageoptimize');

imageoptimize('./test/input_dir/dir1', './test/output_dir/dir1', {p: 70, g: 80, j: 90})
    .then(files => {
        console.log(files);
        // 压缩输出的图片buffer及路径
        // [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
    });
```

### 参数说明

#### imageoptimize(input[, output][, options], callback)

#### input

类型: `String`

文件或者目录的路径

#### output

类型: `String`

压缩输出路径，如果此处传入一个文件路径，则图片会输出到该文件路径的所在的目录下；**如果此处不传任何参数，则输出文件会覆盖源文件**

#### options

类型: `Object`

`p` png图片压缩的质量（1-100），`j` jpg图片压缩的质量（1-100），`g` gif图片压缩的质量（1-100），数字越大图片质量越高。默认均为70，建议使用默认

#### callback

类型： `Function`

压缩成功的回调函数，总共有两个参数。第一个参数为错误信息，第二个参数为返回的所有图片buffer及路径的一个数组

## CLI使用
需要全局`npm install imageoptimize -g`安装

### bash
``` bash
$ imageoptimize -i ./abc/def -o ../xyz
```

### 参数说明
```
选项：
  -i, --input        输入文件或文件夹路径                         [字符串] [必需]
  -o, --output       输出文件夹路径，不传默认覆盖输入路径                  [字符串]
  -j, --jpg-quality  jpg,jpeg压缩质量（1-100，默认70）                    [数字]
  -p, --png-level    png压缩质量（1-100，默认70）                         [数字]
  -g, --gif-colors   gif压缩质量（1-100，默认70）                         [数字]
  --help             显示帮助信息                                        [布尔]
  --version          显示版本号                                          [布尔]

示例：
  $ imageoptimize -i /abc/def -o ../xyz
  $ imageoptimize -i /abc/def -o /Users/myname/Documents/
  $ imageoptimize -i /abc/def
  $ imageoptimize -i /abc/def/efg.png
  $ imageoptimize -i /abc/def/efg.png -o ./xyz
```
