'use strict';
var baseUrl = 'http://www.bing.com/';
var storageFolderName = ".bing-wallpaper";

var fs = require('fs');
var Promise = require("bluebird");
var request = require("request");
var wallpaper = require('wallpaper');
var rp = Promise.promisify(request);
var mkdir = Promise.promisify(fs.mkdir);
var setWallpaper = Promise.promisify(wallpaper.set);
var osenv = require('osenv');
var path = require('path');

function getBingJsonUrl(locale) {
    return baseUrl + 'HPImageArchive.aspx?format=js&idx=0&n=1&mkt=' + locale;
}

function directoryExistsError(e) {
    if (e.code) {
        return e.code === 'EEXIST';
    } else {
        return false;
    }
}

function clientError(e) {
    return e.statusCode >= 400 && e.statusCode < 500;
}

function getTargetDir() {
    return path.join(osenv.home(), storageFolderName);
}

function getTargetFilePath() {
    return path.join(getTargetDir(), 'daily-bing.png');
}

function getDefaultOptions() {
    return {
        locale: 'en-US'
    };
}

function validateOptions(options) {
    var locale = options.locale;
    if (!/^[a-zA-Z]{2}-[a-zA-Z]{2}$/.test(locale)) {
        return "wrong locale format. see help for details."
    }
}

function run(options) {
    return mkdir(getTargetDir())
        .catch(directoryExistsError, function(e) {
            // ignore existing directories.
        })
        .then(function() {
            return rp(getBingJsonUrl(options.locale))
         })
        .then(function(data){
            // map response
            return data[0];
        })
        .then(function(response) {
            if (response.statusCode !== 200) {
                throw response;
            }

            return JSON.parse(response.body);
        })
        .then(function(payload) {
            return baseUrl + payload.images[0].url;
        })
        .then(function(imgUrl) {
            var resolver = Promise.pending();
            var r = request(imgUrl);

            r
            .on('error', function(err) {
                r.abort();
                resolver.reject();
            })
            .on('response', function(res) {
                if (res.statusCode !== 200) {
                    r.abort();
                    resolver.reject(res);
                }
            })
            .pipe(fs.createWriteStream(path.join(getTargetFilePath())))
            .on('error', function () {
                resolver.reject("failed to write local file.");
            })
            .on('finish', function () {
                resolver.resolve();
            });

            return resolver.promise;
        })
        .then(function() {
            return setWallpaper(getTargetFilePath());
        });
}

module.exports = function(options, callback) {
    if (typeof callback === 'undefined') {
        callback = options;
        options = getDefaultOptions();
    }

    if (!options) {
        options = getDefaultOptions();
    } else {
        var errMsg = validateOptions(options)
        if (errMsg) {
            callback(errMsg);
            return;
        }
    }

    run(options)
    .then(function() {
        if (callback) {
            callback();
        }
    })
    .catch(function(e) {
        if (callback) {
            callback(e);
        }
    });
};
