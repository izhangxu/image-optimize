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
 * @return {Object}
 */
const imageMin = (argv) => {
	let _input = argv.i,
		_out = argv.o,
		input_path = '',
		out_path = '',
		relativePath = /^(\.\/|\.\.\/).*/,
		fileRegExp = /(.*)\/(.*)\.(gif|png|jpg|jpeg)/;
	if (!file.isFile(_input) && !file.isDir(_input)) {
		return colors.error('-i 参数不正确(应该传入一个路径)');
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

	file.listDir(input_path).then(paths => Promise.all(paths.map(input => {
		const i_path = path.normalize(/(.*)\.(gif|png|jpg|jpeg)/i.exec(input) ? input : input + '/*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}');
		const o_path = input.replace(input_path, out_path);
		colors.warning('待压缩目录 [' + input + '] 压缩中 ...');
		// console.log(i_path, o_path)
		return imagemin([i_path], o_path, {
			plugins: [
				imageminMozjpeg({
					quality: argv.j || 80
				}),
				imageminGifsicle({
					colors: argv.g || 50
				}),
				imageminPngquant({
					quality: argv.p || 80
				})
			]
		});
	}))).then((files) => {
		const newFiles = [].concat(...files);
		// console.log(newFiles.map(item => item.path).join('\n'));
		colors.warning('共' + newFiles.length + ' 张图片压缩完成');
	}).catch((e) => {
		colors.error(e);
	});
};

module.exports = (opts) => {
	imageMin(opts.flags);
};