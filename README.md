# imagemoptimize
图片压缩工具，支持CLI调用

## 简介
- 支持传入文件夹整体压缩
- 支持压缩单独文件
- 支持处理png、jpg、jpeg、gif
- 支持命令行及引入模块调用

## 安装
``` bash
$ npm clone git@github.com:izhangxu/image-optimize.git
$ npm link
```

## 版本
node >= 5.2.0

## 使用

### CLI使用

#### bash
``` bash
$ imageoptimize -i ./abc/def -o ../xyz
```

#### 参数说明
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
