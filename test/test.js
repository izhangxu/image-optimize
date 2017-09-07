'use strict';

const fs = require('fs');
const test = require('ava');
const execa = require('execa');
const del = require('del');
const readdir = require('recursive-readdir');
const computDirSize = require('../lib/file.js').computDirSize;
const cli = '../bin/imageoptimize.js';
const i = require('../');

process.chdir(__dirname);

// test.after('清除输出目录文件', async t => {
// 	await del(['./output_dir'], {
// 		force: true
// 	});
// });

test('测试--help，cli调用', async t => {
	t.regex(await execa.stdout(cli, ['--help']), /Usage: imageoptimize/);
});

test('测试版本号，cli调用', async t => {
	t.is(await execa.stdout(cli, ['--version']), require('../package.json').version);
});

test('压缩一张图片，cli调用', async t => {
	await execa(cli, ['-i', './input_dir/titan.jpg', '-o', './output_dir/file1']);
	t.true(fs.statSync('./input_dir/titan.jpg').size > fs.statSync('./output_dir/file1/titan.jpg').size);
});

test('压缩一组图片，cli调用', async t => {
	await execa(cli, ['-i', './input_dir/dir', '-o', './output_dir/dir1']);
	const entry = await readdir('./input_dir/dir', ['.DS_Store']);
	const dest = await readdir('./output_dir/dir1', ['.DS_Store']);
	const inputSize = await computDirSize('./input_dir/dir');
	const outputSize = await computDirSize('./output_dir/dir1');
	t.true(entry.length == entry.length);
	t.true(inputSize > outputSize);
});

test('压缩一张不存在图片会提示错误，cli调用', async t => {
	const execute = await execa.stderr(cli, ['-i', 'image.png']);
	t.regex(execute, /参数不正确/);
});

test('压缩一张图片，函数调用', async t => {
	const execute = await i('./input_dir/titan.jpg', './output_dir/file');
	t.is(execute.length, 1);
	t.true(fs.statSync('./input_dir/titan.jpg').size > fs.statSync('./output_dir/file/titan.jpg').size);
});

test('压缩一张不存在图片会提示错误，函数调用', async t => {
	const promise = i('./input_dir/image.jpg');
	const execute = await t.throws(promise);
	t.regex(execute, /参数不正确/);
});

test('压缩一组图片，函数调用', async t => {
	const entry = await i('./input_dir/dir', './output_dir/dir');
	const dest = await readdir('./input_dir/dir', ['.DS_Store']);
	const inputSize = await computDirSize('./input_dir/dir');
	const outputSize = await computDirSize('./output_dir/dir');
	t.true(entry.length == dest.length);
	t.true(inputSize > outputSize);
});