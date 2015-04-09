# bing-wallpaper [![Build Status](https://secure.travis-ci.org/olohmann/bing-wallpaper.png?branch=master)](https://travis-ci.org/olohmann/bing-wallpaper)

> Get the daily bing picture as your wallpaper.

Works on OS X, Linux and Windows.


## CLI

### Install

```
$ npm install --global bing-wallpaper
```

### Usage

```
$ bing-wallpaper --help

  Usage
    $ bing-wallpaper [locale]

  Example
    $ bing-wallpaper ja-JP       // uses bing Japan's daily bing picture
    $ bing-wallpaper             // defaults to en-US  
```


## Programmatic

### Install

```
$ npm install --save bing-wallpaper
```

### Usage

```js
var bing-wallpaper = require('bing-wallpaper');

var options = { locale: 'en-US' };

bingWallpaper(options, function(err) {
    if (err) {
        console.error(err);
    }
});
```

### API

#### (options, callback)

##### options
*Optional*

Type: `object`

Default:
```js
{
    locale: 'en-US'
}
```

##### callback(error)

*Required*  
Type: `function`

## License

MIT © [Oliver Lohmann](http://oliver-lohmann.me)

