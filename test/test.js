const fs = require('fs');
const test = require('ava');
const exec = require('child_process').exec;
const execa = require('execa');
const cli = '../bin/imageoptimize.js';

process.chdir(__dirname);

test('test help', async t => {
	t.regex(await execa.stdout(cli, ['--help']), /Usage: imageoptimize/);
});

test('test version', async t => {
	t.is(await execa.stdout(cli, ['--version']), require('../package.json').version);
});

test('optimize an image', async t => {
	await execa(cli, [ '-i', './titan.jpg', '-o', './output']);
	t.true(fs.statSync('./titan.jpg').size >= fs.statSync('./output/titan.jpg').size);
});

test('output error on corrupt images', async t => {
	await t.throws(execa(cli, ['-i', 'image.png']), /参数不正确/);
});