var RaspiCam = require('raspicam')
var camera = new RaspiCam({
  mode: 'photo',
  output: '/data' // for persistent storage across updates
})

camera.on('read', function(err, timestamp, filename){
  console.log('picture taken/saved', filename)
})

camera.start()

console.log('node is running, thankfully')
