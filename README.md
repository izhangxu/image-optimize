# imagemoptimize
图片压缩工具，支持CLI调用

## 简介
- 支持传入文件夹整体压缩
- 支持压缩单独文件
- 支持png|jpg|jpeg|gif

## 安装
``` bash
npm clone git@github.com:izhangxu/image-optimize.git
npm link
```
## 使用
``` bash
imageoptimize -i ./abc/def -o ../xyz
```

## 参数说明 
```
选项：
  --version      显示版本号                                               	[布尔]
  -i, --input    输入文件或文件夹路径                              	[字符串] [必需]
  -o, --output   输出文件夹路径（不传则在源文件中覆盖输出），输入相对路径        [字符串]
  -j, --quality  jpg,jpeg压缩质量（1-100，默认80）                        [数字]
  -p, --level    png压缩质量（1-100，默认80）                             [数字]
  -g, --colors   gif压缩质量（2-256，默认50）                             [数字]
  --help         显示帮助信息                                             [布尔]

示例：
  $ imageoptimize -i /abc/def -o ../xyz
  $ imageoptimize -i /abc/def -o /Users/myname/Documents/
  $ imageoptimize -i /abc/def
  $ imageoptimize -i /abc/def/efg.png 
  $ imageoptimize -i /abc/def/efg.png -o ./xyz
```
