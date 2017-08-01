const path = require('path');
const cp = require('child_process');
const querystring = require('querystring');
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
		colors.error('待压缩图片路径不正确');
		return false;
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
	// 如果是单独文件
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
	// console.log(input_path, out_path);
	file.getSubDirectory(input_path, out_path, (i, o) => {
		cp.execFile('node', [__dirname + '/handle.js', i, o, querystring.stringify(argv)], (error, stdout) => {
			if (error) {
				throw error;
			}
			colors.success(stdout);
		});
	});
};

module.exports = (opts) => {
	imageMin(opts.flags);
};