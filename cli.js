#!/usr/bin/env node
'use strict';
var meow = require('meow');
var chalk = require('chalk');
var bingWallpaper = require('./');

var cli = meow({
    help: [
        'Usage',
        '  bing-wallpaper [--verbose] [locale]',
        '',
        'Example locales:',
        '  en-US',
        '  de-DE',
        '  ja-JP',
        '',
        'Default locale:',
        '  en-US'
    ].join('\n')
});

var options;

var inputLocale = cli.input[0];
if (inputLocale) {
    options = {locale: inputLocale};
}

bingWallpaper(options, function(err) {
    if (err) {
        console.error(chalk.red('error: ' + err));
    } else {
        if (cli.flags.verbose) {
            console.log(chalk.green('success: wallpaper set.'))
        }
    }
});
