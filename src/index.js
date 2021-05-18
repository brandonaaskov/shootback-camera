const fs = require('fs')
const path = require('path')
const { StreamCamera, Codec } = require('pi-camera-connect')
const ffmpeg = require('fluent-ffmpeg')

const streamCamera = new StreamCamera({ codec: Codec.H264 })

// Import module.
const AudioRecorder = require('node-audiorecorder')

// Options is an optional parameter for the constructor call.
// If an option is not given the default value, as seen below, will be used.
const options = {
  program: `arecord`,     // Which program to use, either `arecord`, `rec`, or `sox`.
  device: 'hw:1,0',       // Recording device to use, e.g. `hw:1,0`

  bits: 16,           // Sample size. (only for `rec` and `sox`)
  channels: 1,        // Channel count.
  encoding: `signed-integer`,  // Encoding type. (only for `rec` and `sox`)
  format: `S16_LE`,   // Encoding type. (only for `arecord`)
  rate: 16000,        // Sample rate.
  type: `wav`,        // Format type.

  // Following options only available when using `rec` or `sox`.
  // silence: 2,         // Duration of silence in seconds before it stops recording.
  // thresholdStart: 0.5,  // Silence threshold to start recording.
  // thresholdStop: 0.5,   // Silence threshold to stop recording.
  // keepSilence: true   // Keep the silence in the recording.
}
// Optional parameter intended for debugging.
// The object has to implement a log and warn function.

// Create an instance.
const logger = console
const audioRecorder = new AudioRecorder(options, logger)

const filepath = path.resolve(__dirname, '..')
const filename = path.resolve(`${filepath}/recordings/capture-${Date.now()}`)

console.log(filename)

const writeStream = fs.createWriteStream(`${filename}.video`)
const videoStream = streamCamera.createStream()

videoStream.pipe(writeStream)

const audioStream = fs.createWriteStream(`${filename}.audio`, { encoding: 'binary' })
// Start and write to the file.

streamCamera.startCapture().then(() => {
  audioRecorder.start().stream().pipe(audioStream)

  setTimeout(() => {
    streamCamera.stopCapture()
    audioRecorder.stop()

    ffmpeg()
      .addInput(`${filename}.video`)
      .addInput(`${filename}.audio`)
      .outputOptions('-c:v', 'copy') // this will copy the data instead or reencode it
      .save(`${filename}.mp4`)
  }, 3000)
})
