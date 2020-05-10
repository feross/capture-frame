/*! capture-frame. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
'use strict'

module.exports = captureFrame

function captureFrame (video, format) {
  if (typeof video === 'string') {
    video = document.querySelector(video)
  }

  if (video == null || video.nodeName !== 'VIDEO') {
    throw new TypeError('First argument must be a <video> element or selector')
  }

  if (format == null) {
    format = 'png'
  }

  if (format !== 'png' && format !== 'jpeg' && format !== 'webp') {
    throw new TypeError('Second argument must be one of "png", "jpeg", or "webp"')
  }

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  canvas.getContext('2d').drawImage(video, 0, 0)

  const dataUri = canvas.toDataURL('image/' + format)
  const data = dataUri.split(',')[1]

  return Buffer.from(data, 'base64')
}
