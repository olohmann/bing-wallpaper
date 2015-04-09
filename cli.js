#!/usr/bin/env node
'use strict';
var meow = require('meow');
var bingWallpaper = require('./');

var cli = meow({
    help: [
        'Usage',
        '  bing-wallpaper [locale]'
    ].join('\n')
});

var options;

var inputLocale = cli.input[0];
if (inputLocale) {
    options = {locale: inputLocale};
}

bingWallpaper(options, function(err) {
    if (err) {
        console.log(err);
    }
});
