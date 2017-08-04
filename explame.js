const imageoptimize = require('./index.js');

// imageoptimize('../123', '../234');
// 
// 
const file = require('./lib/file.js');

file.listFiles('./test/')
	.then(e => {
		console.log(e);
	});

// file.computDirSize('./test', function(e) {
// 	console.log(e)
// })