const fs = require('fs')
const { StreamCamera, Codec } = require('pi-camera-connect')
const ffmpeg = require('fluent-ffmpeg')

const streamCamera = new StreamCamera({ codec: Codec.H264 })
const writeStream = fs.createWriteStream('video.h264')
const videoStream = streamCamera.createStream()

videoStream.pipe(writeStream)

streamCamera.startCapture().then(() => {
  setTimeout(() => {
    streamCamera.stopCapture()
    
    const inFilename = 'video.h264'
    const outFilename = 'video.mp4'

    ffmpeg(inFilename)
      .outputOptions("-c:v", "copy") // this will copy the data instead or reencode it
      .save(outFilename)
  }, 5000)
})
