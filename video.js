var RaspiCam = require('raspicam')

var video = new RaspiCam({
  mode: 'video',
  output: './videos/file-' + Date.now() + '.mov',
  c: ''
})

video.on('read', function(err, timestamp, filename){
  console.log('video saved', filename)
})

video.on('data', function(data) {
  console.log('video data buffer', data)
})

module.exports = video
