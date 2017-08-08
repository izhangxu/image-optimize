'use strict';

const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const colors = require('../colors.js');
const file = require('../file.js');

/**
 * 处理图片
 * @param  {Object} argv
 * @param  {Object} callback 存在时说明是函数调用
 * @return {Object}
 */
module.exports = (argv, callback) => {
	let _input = argv.i,
		_out = argv.o,
		input_path = '',
		out_path = '',
		relativePath = /^(\.\/|\.\.\/).*/,
		fileRegExp = /(.*)\/(.*)\.(gif|png|jpg|jpeg)/;
	if (!file.isFile(_input) && !file.isDir(_input)) {
		if (callback) {
			return callback('-i 参数不正确(应该传入一个路径)');
		} else {
			return colors.error('-i 参数不正确(应该传入一个路径)');
		}
	}
	input_path = path.join(process.cwd(), _input);

	// 如果是文件夹
	if (file.isDir(input_path)) {
		input_path = file.realpath(input_path);
		if (argv.o) {
			out_path = relativePath.exec(_out) ? path.join(process.cwd(), _out) : _out;
			if (!file.isDir(out_path)) {
				file.mkdir(out_path);
			}
			out_path = file.realpath(out_path);
		} else {
			out_path = input_path;
		}
	}
	// 如果是单独文件，获取输出文件的dirname
	if (file.isFile(input_path)) {
		if (argv.o) {
			out_path = relativePath.exec(_out) ? path.join(process.cwd(), _out) : _out;
			out_path = fileRegExp.exec(out_path) ? fileRegExp.exec(out_path)[1] : out_path;
			if (!file.isDir(out_path)) {
				file.mkdir(out_path);
			}
		} else {
			out_path = file.realpath(input_path);
		}
	}

	input_path = path.normalize(input_path);
	out_path = path.normalize(out_path);

	file.computDirSize(input_path)
		.then(size => {
			!callback && colors.warning('待压缩目录 ' + input_path + ' (size: ' + Math.round(size / 1024) + ' k) 压缩中 ...');
			return file.getSubDirs(input_path);
		})
		.then(paths => Promise.all(paths.map(input => {
			const i_path = /(.*)\.(gif|png|jpg|jpeg)/i.exec(input) ? input : path.normalize(input + '/*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}');
			const o_path = input.replace(input_path, out_path);

			return imagemin([i_path], o_path, {
				plugins: [
					imageminMozjpeg({
						quality: Math.min(argv.j, 100)
					}),
					imageminGifsicle({
						colors: Math.min(argv.g, 100)  * Math.ceil(256 / 100)
					}),
					imageminPngquant({
						quality: Math.min(argv.p, 100)
					})
				]
			});
		})))
		.then(files => {
			if (!callback) {
				files = [].concat(...files);
				colors.warning('\n图片压缩至：');
				colors.warning(files.map(item => item.path).join('\n'));
				colors.success('共 ' + files.length + ' 张图片压缩完成');
			} else {
				callback(null, [].concat(...files));
			}
			return file.computDirSize(out_path);
		})
		.then((size) => {
			!callback && colors.warning('\n输出目录 ' + out_path + ' (size: ' + Math.round(size / 1024) + ' K)');
		})
		.catch((e) => {
			if (callback) {
				callback && callback(e);
			} else {
				colors.error(e);
			}
		});
};