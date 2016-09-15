const captureFrame = require('../')
const fs = require('fs')
const path = require('path')
const test = require('tape')

const EXPECTED_FRAME = fs.readFileSync(path.join(__dirname, 'frame.png'))

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

test('works on test.webm', (t) => {
  t.plan(2)

  const video = document.createElement('video')
  video.addEventListener('canplay', onCanPlay)

  video.volume = 0
  video.setAttribute('crossOrigin', 'anonymous')
  video.src = `http://localhost:${window.ZUUL.port}/test.webm`
  video.play()

  function onCanPlay () {
    video.removeEventListener('canplay', onCanPlay)
    video.addEventListener('seeked', onSeeked)

    video.currentTime = 2
  }

  function onSeeked () {
    video.removeEventListener('seeked', onSeeked)

    const buf = captureFrame(video)

    // unload video element
    video.pause()
    video.src = ''
    video.load()

    t.ok(buf.length, 'Captured image contains data')
    t.deepEqual(buf, EXPECTED_FRAME)
  }
})
