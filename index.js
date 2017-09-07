'use strict';

const imageoptimize = require('./lib/cli');

/**
 * 压缩图片
 * @param  {String}   input    输入路径
 * @param  {String}   output   输出路径
 * @param  {Object}   opts     { p: null, g: null, j: null }
 * @return {Function}          
 */
module.exports = (input, output, opts) => {
	if (!input || typeof input !== 'string') {
		return Promise.reject('input 参数不正确或未输入');
	}
	if (typeof output === 'object') {
		opts = output;
		output = null;
	}
	opts = Object.assign({
		j: 70,
		g: 70,
		p: 70
	}, opts);

	return imageoptimize(Object.assign({
		i: input,
		o: output
	}, opts), true);
};