const captureFrame = require('../')
const fileType = require('file-type')
const test = require('tape')

test('throws on invalid arguments', (t) => {
  t.throws(() => {
    captureFrame('.invalid-selector')
  })

  t.throws(() => {
    captureFrame(null)
  })

  t.throws(() => {
    const div = document.createElement('div')
    captureFrame(div)
  })

  t.throws(() => {
    const video = document.createElement('video')
    captureFrame(video, 'xxxx') // invalid format
  })

  t.end()
})

function captureFromTestWebm (t, format, cb) {
  const video = document.createElement('video')
  video.addEventListener('canplay', onCanPlay)

  video.volume = 0
  video.setAttribute('crossOrigin', 'anonymous')
  video.src = '/test.webm'
  video.play()

  function onCanPlay () {
    video.removeEventListener('canplay', onCanPlay)
    video.addEventListener('seeked', onSeeked)

    video.currentTime = 2
  }

  function onSeeked () {
    video.removeEventListener('seeked', onSeeked)

    const buf = captureFrame(video, format)

    // unload video element
    video.pause()
    video.src = ''
    video.load()

    t.ok(buf.length, 'Captured image contains data')
    cb(null, buf)
  }
}

test('capture frame from `test.webm` (default)', (t) => {
  t.plan(3)
  captureFromTestWebm(t, null, (err, buf) => {
    t.error(err)
    t.equal(fileType(buf).ext, 'png')
  })
})

test('capture frame from `test.webm` (png)', (t) => {
  t.plan(3)
  captureFromTestWebm(t, 'png', (err, buf) => {
    t.error(err)
    t.equal(fileType(buf).ext, 'png')
  })
})

test('capture frame from `test.webm` (jpeg)', (t) => {
  t.plan(3)
  captureFromTestWebm(t, 'jpeg', (err, buf) => {
    t.error(err)
    t.equal(fileType(buf).ext, 'jpg')
  })
})
