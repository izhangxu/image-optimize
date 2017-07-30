const fs = require('fs');
const iconv = require('iconv-lite');
const u = require('./utils');
const path = require('path');

let file = {
	isFile: function(path) {
		return fs.existsSync(path) && fs.statSync(path).isFile();
	},
	isDir: function(path) {
		return fs.existsSync(path) && fs.statSync(path).isDirectory();
	},
	isWin: process.platform.indexOf('win') === 0,
	realpath: function(path) {
		if (path && fs.existsSync(path)) {
			path = fs.realpathSync(path);
			if (file.isWin) {
				path = path.replace(/\\/g, '/');
			}
			if (path !== '/') {
				path = path.replace(/\/$/, '');
			}
			return path;
		} else {
			return false;
		}
	},
	/**
	 * 文件夹/文件复制不包括那些文件
	 * @param  {String} filename 路径
	 * @return {Boolean}          
	 */
	excludeFiles: function(filename) {
		return !(/.svn|Thumbs.db|.DS_Store/.test(filename));
	},
	/**
	 * 写入文件
	 * @param  {String} path     路径
	 * @param  {String} content  内容
	 * @param  {String} encoding 编码
	 * @return {undefined}
	 */
	write: function(path, content, encoding) {
		try {
			encoding = encoding || 'utf8';
			if (encoding == 'bgk') {
				let s = iconv.decode(content, 'gbk');
				content = iconv.encode(s, 'gbk');
			}
			fs.writeFileSync(path, content, encoding);
		} catch (e) {
			console.log('error [file.write]' + path);
			console.log(e);
		}
	},
	/**
	 * 创建文件目录
	 * @param  {Stribg}   p    目录名称（绝对地址）
	 * @param  {Number}   mode 权限
	 * @param  {Function} cb   回调函数
	 * @return {undefined}
	 */
	mkdir: function(p, mode, cb) {
		let arr = u.trim(p).split('/');
		if (mode === undefined) {
			mode = 0777 & (~process.umask());
		}
		if (typeof mode === 'string') {
			mode = parseInt(mode, 8);
		}
		arr[arr.length - 1] === '' && arr.pop();
		arr[0] === '' && arr.splice(0, 2, '/' + arr[1]); // /aaa
		arr[0] == '.' && arr.shift(); // ./aaa
		arr[0] == '..' && arr.splice(0, 2, arr[0] + '/' + arr[1]); // ../aaa/bbb
		function inner(cur) {
			if (!fs.existsSync(cur)) {
				fs.mkdirSync(cur, mode);
			}
			if (arr.length) {
				inner(cur + '/' + arr.shift());
			} else {
				typeof cb == 'function' && cb();
			}
		}
		arr.length && inner(arr.shift());
	},
	/**
	 * 删除文件目录/文件路径
	 * @param  {String} path 目录名称/文件路径
	 * @return {undefined}
	 */
	rmdir: function(path) {
		let files = [];
		if (fs.existsSync(path)) {
			if (file.isDir(path)) {
				files = fs.readdirSync(path);
				files.forEach(function(f) {
					let curPath = path + '/' + f;
					if (file.isDir(curPath)) {
						file.rmdir(curPath);
					} else {
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(path);
			} else {
				if (file.isFile(path)) {
					fs.unlinkSync(path);
				}
			}
		}
	},
	imageminInput: '',
	getSubDirectory: (input, out, cb) => {
		let oPath = {},
			newOut = '';
		if (input == out) {
			newOut = input;
		}
		if (!file.imageminInput) {
			file.imageminInput = input;
		}
		if (fs.existsSync(input)) {
			if (file.isDir(input)) {
				files = fs.readdirSync(input);
				files.forEach((f) => {
					const sPath = input + '/' + f;
					if (file.isDir(sPath)) {
						return file.getSubDirectory(sPath, out, cb);
					} else {
						if (!oPath[input]) {
							oPath[input] = 1;
							newOut = input.replace(file.imageminInput, out);
							typeof cb === 'function' && cb(input, newOut);
						}
					}
				});
			} else {
				if (file.isFile(input)) {
					if (file.isFile(out)) {
						newOut = path.dirname(out);
					} else {
						if (file.isDir(out)) {
							newOut = out;
						}
					}
					typeof cb === 'function' && cb(input, newOut);
				}
			}
		} else {
			console.log('file.js 获取子目录错误');
		}
	}
};
module.exports = file;