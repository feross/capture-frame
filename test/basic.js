const captureFrame = require('../')
const FileType = require('file-type/browser')
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

function captureFromTestMp4 (format, cb) {
  const video = document.createElement('video')
  video.addEventListener('canplay', onCanPlay)

  video.volume = 0
  video.autoplay = true
  video.muted = true
  video.src = '/test.mp4'
  document.body.append(video)

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

    video.remove()

    cb(null, buf)
  }
}

test('capture frame from `test.mp4` (default)', (t) => {
  t.plan(3)
  captureFromTestMp4(null, async (err, buf) => {
    t.error(err)
    t.ok(buf.length, 'Captured image contains data')
    t.equal((await FileType.fromBuffer(buf)).ext, 'png')
  })
})

test('capture frame from `test.mp4` (png)', (t) => {
  t.plan(3)
  captureFromTestMp4('png', async (err, buf) => {
    t.error(err)
    t.ok(buf.length, 'Captured image contains data')
    t.equal((await FileType.fromBuffer(buf)).ext, 'png')
  })
})

test('capture frame from `test.mp4` (jpeg)', (t) => {
  t.plan(3)
  captureFromTestMp4('jpeg', async (err, buf) => {
    t.error(err)
    t.ok(buf.length, 'Captured image contains data')
    t.equal((await FileType.fromBuffer(buf)).ext, 'jpg')
  })
})
