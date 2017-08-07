'use strict';

const chalk = require('chalk');
const log = console.log;
const error = chalk.bold.red;
const warning = chalk.yellow;
const success = chalk.green;

module.exports = {
	error: (str) => {
		log(error(str));
	},
	warning: (str) => {
		log(warning(str));
	},
	success: (str) => {
		log(success(str));
	}
};