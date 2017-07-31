const imageoptimize = require('./lib/cli');
const colors = require('./lib/colors.js');

module.exports = (input, output, opts) => {
	if (!input) {
		colors.error('input 参数不正确(应该传入一个路径)');
		return false;
	}

	if (typeof output === 'object') {
		opts = output;
		output = null;
	}

	opts = Object.assign({
		p: 70,
		g: 50,
		j: 70
	}, opts);

	return imageoptimize({
		flags: {
			i: input,
			o: output,
			p: opts.p,
			g: opts.g,
			j: opts.j
		}
	});
};