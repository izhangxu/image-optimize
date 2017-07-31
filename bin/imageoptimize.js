#!/usr/bin/env node

const pkg = require('../package.json');
const commandOptions = require('../lib/cli/options.json');

// 处理命令
const handleArgv = (yargs) => {
	let out = yargs
		.usage('Usage: $0 [options]')
		.options(commandOptions.imagemin)
		.demandOption('i')
		.example('Usage: $0 -i /abc/edf -o ../xyz')
		.help()
		.argv;

	if (out.help) {
		return yargs.showHelp();
	}
	require('../lib/cli')({
		flags: out
	});
};


if (!module.parent) {
	let yargs = require('yargs')
		.command('imagemin', '图片压缩')
		.version(() => pkg.version)
		.epilogue("查看使用文档，输入 imagemin --help");

	const argv = yargs.argv,
		command = Object.keys(argv),
		valid = ['i', 'o', 'q', 'l', 'c', 'help'];
	let flag = false;

	valid.forEach((item) => {
		if (command.indexOf(item) > -1) {
			flag = true;
			return false;
		}
	});

	if (flag) {
		handleArgv(yargs.reset());
	} else {
		yargs.showHelp();
	}
} 