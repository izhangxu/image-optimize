#!/usr/bin/env node
const pkg = require('../package.json');
const commandOptions = require('../lib/cli/options.json');

// 处理命令
if (!module.parent) {
	let argv = require('yargs')
		.usage('Usage: imageoptimize [options]')
		.options(commandOptions.imagemin)
		.demandOption('i')
		.example('Usage: imageoptimize -i /abc/edf -o ../xyz')
		.help()
		.version(() => pkg.version)
		.epilogue("查看使用文档，输入 imagemin --help")
		.argv;
	
	require('../lib/cli')({
		flags: argv
	});
}