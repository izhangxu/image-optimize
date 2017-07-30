const querystring = require('querystring');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const argv = process.argv;
const input_path = /(.*)\.(gif|png|jpg|jpeg)/.exec(argv[2]) ? argv[2] : argv[2] + '/*.{jpg,jpeg,png,gif}';
const out_path = argv[3];
const argvs = querystring.parse(argv[4]);

// console.log(input_path,out_path)
console.log('输入目录 [' + argv[2] + '] 压缩中 ...');
imagemin([input_path], out_path, {
	plugins: [
		imageminMozjpeg({
			quality: argvs.j || 80
		}),
		imageminGifsicle({
			colors: argvs.g || 50
		}),
		imageminPngquant({
			quality: argvs.p || 80
		})
	]
}).then((files) => {
	// files = files.map((item) => {
	// 	return '    ' + item.path;
	// }).join('\n');
	console.log(files.length + ' 张图片压缩完成');
	console.log('输出目录 [' + out_path + '] 图片压缩成功');
}).catch((e) => {
	console.log(e);
});