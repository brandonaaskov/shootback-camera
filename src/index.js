const fs = require('fs')
const path = require('path')
const { StreamCamera, Codec } = require('pi-camera-connect')
const ffmpeg = require('fluent-ffmpeg')

const streamCamera = new StreamCamera({ codec: Codec.H264 })

const filepath = path.resolve(__dirname, '..')
const filename = path.resolve(`${filepath}/recordings/capture-${Date.now()}`)

console.log(filename)

const writeStream = fs.createWriteStream(`${filename}.h264`)
const videoStream = streamCamera.createStream()

videoStream.pipe(writeStream)

streamCamera.startCapture().then(() => {
  setTimeout(() => {
    streamCamera.stopCapture()
    
    const inFilename = `${filename}.h264`
    const outFilename = `${filename}.mp4`

    ffmpeg(inFilename)
      .outputOptions('-c:v', 'copy') // this will copy the data instead or reencode it
      .save(outFilename)
  }, 3000)
})
