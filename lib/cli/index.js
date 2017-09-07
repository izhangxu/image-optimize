'use strict';

const fs = require('fs');
const path = require('path');
const pify = require('pify');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const colors = require('../colors.js');
const file = require('../file.js');
const pfs = pify(fs);

const handlePath = (p) => {
	return /^(\/).*/.exec(p) ? p : path.join(process.cwd(), p);
};
const handleImagePath = (p) => {
	return /(.*)\.(gif|png|jpg|jpeg)/i.exec(p) ? p : path.normalize(p + '/*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}');
};
/**
 * 处理图片
 * @param  {Object} argv
 * @param  {Object} callback 存在时说明是函数调用
 * @return {Object}
 */
module.exports = (argv, isModule) => {
	let _input = argv.i,
		_out = argv.o,
		bShowDetailOfCLI = argv.d,
		sInputPath = '',
		sOutputPath = '',
		sRealInputPath = '',
		sRealOutputPath = '',
		regExpFile = /(.*)\/(.*)\.(gif|png|jpg|jpeg)/;

	if (!file.isFile(_input) && !file.isDir(_input)) {
		return Promise.reject('-i 参数不正确(应该传入一个路径)');
	}
	sInputPath = handlePath(_input);

	// 如果是文件夹
	if (file.isDir(sInputPath)) {
		sInputPath = file.realpath(sInputPath);
		if (argv.o) {
			sOutputPath = handlePath(_out);
			if (!file.isDir(sOutputPath)) {
				file.mkdir(sOutputPath);
			}
			sOutputPath = file.realpath(sOutputPath);
		} else {
			sOutputPath = sInputPath;
		}
	}
	// 如果是单独文件，获取输出文件的dirname
	if (file.isFile(sInputPath)) {
		if (argv.o) {
			sOutputPath = handlePath(_out);
			sOutputPath = regExpFile.exec(sOutputPath) ? regExpFile.exec(sOutputPath)[1] : sOutputPath;
			if (!file.isDir(sOutputPath)) {
				file.mkdir(sOutputPath);
			}
		} else {
			sOutputPath = file.realpath(sInputPath);
		}
	}

	sInputPath = path.normalize(sInputPath);
	sOutputPath = path.normalize(sOutputPath);

	if (isModule) {
		return file.getSubDirs(sInputPath)
			.then(paths => Promise.all(paths.map(input => {
				sRealInputPath = sRealInputPath = handleImagePath(input);
				sRealOutputPath = input.replace(sInputPath, sOutputPath);
				return imagemin([sRealInputPath], sRealOutputPath, {
					plugins: [
						imageminMozjpeg({
							quality: Math.min(argv.j, 100)
						}),
						imageminGifsicle({
							colors: Math.min(argv.g, 100) * Math.ceil(256 / 100)
						}),
						imageminPngquant({
							quality: Math.min(argv.p, 100)
						})
					]
				});
			})))
			.then(files => {
				return Promise.resolve([].concat(...files));
			})
			.catch((e) => {
				colors.error(e);
			});
	} else {
		return file.computDirSize(sInputPath)
			.then(size => {
				bShowDetailOfCLI && colors.warning('待压缩目录 ' + sInputPath + ' 图片共(size: ' + Math.round(size / 1024) + ' k) 压缩中 ...');
				return file.getSubDirs(sInputPath);
			})
			.then(paths => Promise.all(paths.map(input => {
				sRealInputPath = handleImagePath(input);
				sRealOutputPath = input.replace(sInputPath, sOutputPath);
				return imagemin([sRealInputPath], sRealOutputPath, {
					plugins: [
						imageminMozjpeg({
							quality: Math.min(argv.j, 100)
						}),
						imageminGifsicle({
							colors: Math.min(argv.g, 100) * Math.ceil(256 / 100)
						}),
						imageminPngquant({
							quality: Math.min(argv.p, 100)
						})
					]
				});
			})))
			.then(files => {
				files = [].concat(...files);
				if (bShowDetailOfCLI) {
					colors.warning('\n图片压缩至：');
					colors.warning(files.map(item => item.path).join('\n'));
					colors.success('共 ' + files.length + ' 张图片压缩完成');
				}
				return Promise.all(files.map(file => {
					return pfs.stat(file.path);
				}));
			})
			.then(stats => {
				if (bShowDetailOfCLI) {
					const countSize = stats.reduce((sum, value) => {
						return sum + value.size;
					}, 0);
					colors.warning('\n输出目录 ' + sOutputPath + ' 压缩完成的图片共(size: ' + Math.round(countSize / 1024) + ' K)');
				}
			})
			.catch((e) => {
				colors.error(e);
			});
	}
};