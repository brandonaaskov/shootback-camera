var RaspiCam = require('raspicam')
var camera = new RaspiCam({
  mode: 'photo',
  output: './stills/file-' + Date.now() + '.jpg'
})

camera.on('read', function(err, timestamp, filename){
  console.log('picture taken/saved', filename)
})

camera.start()

console.log('node is running, thankfully')
