var RaspiCam = require('raspicam')

var video = new RaspiCam({
  mode: 'video',
  output: './videos/file-' + Date.now() + '.mov',
  b: 2300000, //bits per second (2,300kbps/2.3mbps)
  fps: 30,
  c: ''
})

video.on('read', function(err, timestamp, filename){
  console.log('video saved', filename)
})

module.exports = video
