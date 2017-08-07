const fs = require('fs');
const test = require('ava');
const exec = require('child_process').exec;
const execa = require('execa');
const del = require('del');
const readdir = require('recursive-readdir');
const cli = '../bin/imageoptimize.js';
const i = require('../');

process.chdir(__dirname);

test('测试--help，cli调用', async t => {
	t.regex(await execa.stdout(cli, ['--help']), /Usage: imageoptimize/);
});

test('测试版本号，cli调用', async t => {
	t.is(await execa.stdout(cli, ['--version']), require('../package.json').version);
});

test('压缩一张图片，cli调用', async t => {
	await del(['./output_dir'], {
		force: true
	});
	await execa(cli, ['-i', './input_dir/file1.jpg', '-o', './output_dir']);
	t.true(fs.statSync('./input_dir/file1.jpg').size >= fs.statSync('./output_dir/file1.jpg').size);
});

test('压缩一组图片，cli调用', async t => {
	await del(['./output_dir'], {
		force: true
	});
	await execa(cli, ['-i', './input_dir/dir1', '-o', './output_dir/dir1']);
	const entry = await readdir('./input_dir/dir1', ['.DS_Store']);
	const dest = await readdir('./output_dir/dir1', ['.DS_Store']);
	t.true(entry.length == entry.length);
	t.true(fs.statSync('./input_dir/file1.jpg').size >= fs.statSync('./output_dir/file1.jpg').size);
});

test('压缩一张不存在图片会提示错误，cli调用', async t => {
	t.regex(await execa.stdout(cli, ['-i', 'image.png']), /参数不正确/);
});

test('压缩一张图片，函数调用', async t => {
	await del(['./output_dir/file1.jpg'], {
		force: true
	});
	const execute = await new Promise((resolve, reject) => {
		i('./input_dir/file1.jpg', './output_dir', (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	});
	await t.is(execute.length, 1);
	t.true(fs.statSync('./input_dir/file1.jpg').size >= fs.statSync('./output_dir/file1.jpg').size);
});

test('压缩一张不存在图片会提示错误，函数调用', async t => {
	const execute = new Promise((resolve, reject) => {
		i('./input_dir/image.jpg', (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
	await t.throws(execute, /参数不正确/);
});

test('压缩一组图片，函数调用', async t => {
	await del(['./output_dir'], {
		force: true
	});
	const execute = await new Promise((resolve, reject) => {
		i('./input_dir/dir1', './output_dir/dir1', (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	});
	const dest = await readdir('./input_dir/dir1', ['.DS_Store']);
	t.true(execute.length == dest.length);
	t.true(fs.statSync('./input_dir/file1.jpg').size >= fs.statSync('./output_dir/file1.jpg').size);
});