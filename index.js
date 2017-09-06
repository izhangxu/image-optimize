'use strict';

const imageoptimize = require('./lib/cli');

/**
 * 压缩图片
 * @param  {String}   input    输入路径
 * @param  {String}   output   输出路径
 * @param  {Object}   opts     { p: null, g: null, j: null }
 * @param  {Function} callback 成功回调
 * @return {Function}          
 */
module.exports = (input, output, opts, callback) => {
	callback = callback || function() {}

	if (!input || typeof input !== 'string') {
		return callback('-i 参数不正确或未输入');
	}
	if (typeof output === 'object') {
		opts = output;
		output = null;
	}
	if (typeof output === 'function') {
		callback = output;
		output = null;
		opts = {};
	}
	if (typeof opts === 'function') {
		callback = opts;
		opts = {};
	}

	return imageoptimize(Object.assign({
		i: input,
		o: output
	}, opts), callback);
};