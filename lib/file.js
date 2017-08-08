'use strict';

const fs = require('fs');
const path = require('path');
const pify = require('pify');
const pathTemp = {};

const pfs = pify(fs);

let file = {
	isFile: (path) => fs.existsSync(path) && fs.statSync(path).isFile(),
	isDir: (path) => fs.existsSync(path) && fs.statSync(path).isDirectory(),
	isWin: process.platform.indexOf('win') === 0,
	realpath: (path) => {
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
	 * 创建文件目录
	 * @param  {Stribg}   p    目录名称（绝对地址）
	 * @param  {Number}   mode 权限
	 * @param  {Function} cb   回调函数
	 * @return {undefined}
	 */
	mkdir: (p, mode, cb) => {
		let arr = p.replace(/(^\s*)|(\s*$)/g, '').split('/');
		if (mode === undefined) {
			mode = 0o0777 & (~process.umask());
		}
		if (typeof mode === 'string') {
			mode = parseInt(mode, 8);
		}
		arr[arr.length - 1] === '' && arr.pop();
		arr[0] === '' && arr.splice(0, 2, '/' + arr[1]); // /aaa
		arr[0] == '.' && arr.shift(); // ./aaa
		arr[0] == '..' && arr.splice(0, 2, arr[0] + '/' + arr[1]); // ../aaa/bbb
		let inner = (cur) => {
			if (!fs.existsSync(cur)) {
				fs.mkdirSync(cur, mode);
			}
			if (arr.length) {
				inner(cur + '/' + arr.shift());
			} else {
				typeof cb === 'function' && cb();
			}
		}
		arr.length && inner(arr.shift());
	},
	/**
	 * 删除文件目录/文件路径
	 * @param  {String} path 目录名称/文件路径
	 * @return {undefined}
	 */
	rmdir: (path) => {
		let files = [];
		if (fs.existsSync(path)) {
			if (file.isDir(path)) {
				files = fs.readdirSync(path);
				files.forEach(f => {
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
	/**
	 * 寻找子目录
	 * @param  {String} dir
	 * @return {Object} .then(e => {Array.isArray(e) // true})
	 */
	getSubDirs: (dir, isDir) => {
		if (file.isFile(dir) && !isDir) {
			return pfs.stat(dir).then(() => [dir]);
		} else {
			return pfs.stat(dir)
				.then(stats => {
					if (stats.isDirectory()) {
						return pfs.readdir(dir)
							.then(list => Promise.all(list.map(item =>
								file.getSubDirs(path.resolve(dir, item), true)
							)))
							.then(subtree => {
								const arr = [].concat(...subtree);
								return Array.from(new Set(arr));
							});
					} else {
						if (pathTemp[path.dirname(dir)]) {
							return [];
						}
						pathTemp[path.dirname(dir)] = 1;
						return [path.dirname(dir)];
					}
				});
		}
	},
	/**
	 * 查找目录中所有文件
	 * @param  {String} dir 
	 * @return {Object} .then(e => {Array.isArray(e) // true})
	 */
	getSubFiles: (dir) => {
		return pfs.stat(dir)
			.then(stats => {
				if (stats.isDirectory()) {
					return pfs.readdir(dir)
						.then(list => Promise.all(list.map(item => file.getSubFiles(path.resolve(dir, item)))))
						.then(subtree => [].concat(...subtree));
				} else {
					return [dir];
				}
			});
	},
	/**
	 * 计算文件夹的size
	 * @param  {String} dir 
	 * @return {Object}
	 */
	computDirSize: (dir) => {
		return file.getSubFiles(dir)
			.then(file => Promise.all(file.map(item => {
				return pfs.stat(item);
			})))
			.then(stats => {
				return stats.reduce((sum, value) => {
					return sum + value.size;
				}, 0);
			})
	}
};

module.exports = file;