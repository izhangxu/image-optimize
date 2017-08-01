var fs = require('fs');
var path = require('path');
var pify = require('pify');
var pathTemp = {};

function readdirPromisify(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, list) => {
            if (err) {
                reject(err);
            }
            resolve(list);
        });
    });
}

function statPromisify(dir) {
    return new Promise((resolve, reject) => {
        fs.stat(dir, (err, stats) => {
            if (err) {
                reject(err);
            }
            resolve(stats);
        });
    });
}

function listDir(dir) {
    // return statPromisify(dir).then(stats => {
    //     if (stats.isDirectory()) {
    //         return readdirPromisify(dir)
    //         .then(list => 
    //             Promise.all(list.map(item => 
    //                 listDir(path.resolve(dir, item))
    //             ))
    //         ).then(subtree => {
    //             const arr = [].concat(...subtree);
    //             return Array.from(new Set(arr));
    //         });
    //     } else {
    //         if (pathTemp[path.dirname(dir)]) {
    //             return [];
    //         }
    //         pathTemp[path.dirname(dir)] = 1;
    //         return [path.dirname(dir)];
    //     }
    // });
    const pfs = pify(fs);
    return pfs.stat(dir)
        .then(stats => {
            if (stats.isDirectory()) {
                return pfs.readdir(dir)
                    .then(list =>
                        Promise.all(list.map(item => {
                            return listDir(path.resolve(dir, item))
                        }))
                    ).then(subtree => {
                        const arr = [].concat(...subtree);
                        return Array.from(new Set(arr));
                    });
            } else {
                if (pathTemp[path.dirname(dir)]) {
                    return [];
                }
                pathTemp[path.dirname(dir)] = 1;
                return [path.dirname(dir)];
            }
        });
}

listDir('../123').then(function(a) {
    console.log(a);
});