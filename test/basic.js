const captureFrame = require('../')
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

test('capture frame from `test.webm`', (t) => {
  t.plan(2)

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

    const buf = captureFrame(video)

    // unload video element
    video.pause()
    video.src = ''
    video.load()

    t.ok(buf.length, 'Captured image contains data')
    t.deepEqual(buf.slice(0, 8).toString('hex'), '89504e470d0a1a0a')
  }
})
