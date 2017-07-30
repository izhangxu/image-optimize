const imagemin = require('./bin/imagemin.js');

module.exports = {
	init: (argv) => {
		imagemin.init(argv);
	}
};