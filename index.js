const imageoptimize = require('./lib/cli');

module.exports = (input, output, opts, callback = () => {}) => {
	if (!input || typeof input !== 'string') {
		callback('-i 参数不正确或未输入');
		return colors.error('-i 参数不正确未输入');
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
	opts = Object.assign({
		p: 70,
		g: 50,
		j: 70
	}, opts);

	return imageoptimize(Object.assign({
		i: input,
		o: output
	}, opts), callback);
};