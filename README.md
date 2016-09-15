# capture-frame [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

[travis-image]: https://img.shields.io/travis/feross/capture-frame/master.svg
[travis-url]: https://travis-ci.org/feross/capture-frame
[npm-image]: https://img.shields.io/npm/v/capture-frame.svg
[npm-url]: https://npmjs.org/package/capture-frame
[downloads-image]: https://img.shields.io/npm/dm/capture-frame.svg
[downloads-url]: https://npmjs.org/package/capture-frame

### Capture video screenshot from a `<video>` tag

[![Sauce Test Status](https://saucelabs.com/browser-matrix/capture-frame.svg)](https://saucelabs.com/u/capture-frame)

Works in the browser with [browserify](http://browserify.org/)! This module is used by [WebTorrent Desktop](http://webtorrent.io/desktop).

## install

```
npm install capture-frame
```

## usage

### simple example

```js
const captureFrame = require('capture-frame')

const frame = captureFrame('.video')

// show the captured video frame in the DOM
const image = document.createElement('img')
image.src = window.URL.createObjectURL(new window.Blob([buf]))
document.body.appendChild(image)
```

### complete example

```js
const captureFrame = require('capture-frame')

const video = document.createElement('video')
video.addEventListener('canplay', onCanPlay)

video.volume = 0
video.setAttribute('crossOrigin', 'anonymous') // optional, when cross-domain
video.src = `http://example.com/test.webm`
video.play()

function onCanPlay () {
  video.removeEventListener('canplay', onCanPlay)
  video.addEventListener('seeked', onSeeked)

  video.currentTime = 2 // seek 2 seconds into the video
}

function onSeeked () {
  video.removeEventListener('seeked', onSeeked)

  const buf = captureFrame(video)

  // unload video element, to prevent memory leaks
  video.pause()
  video.src = ''
  video.load()

  // show the captured image in the DOM
  const image = document.createElement('img')
  image.src = window.URL.createObjectURL(new window.Blob([buf]))
  document.body.appendChild(image)
}
```

## api

### `frame = captureFrame(video, [format])`

Capture a video frame the the video tag specified by `video`. This can be a
reference to a video element in the page, or a string CSS selector. This must
refer to a video element.

Optionally, specify a `format` for the image to be captured in. Must be one of
"png", "jpg", or "webp".

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
