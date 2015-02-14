var RaspiCam = require('raspicam')
var photo = new RaspiCam({
  mode: 'photo',
  output: './stills/file-' + Date.now() + '.jpg'
})

photo.on('read', function(err, timestamp, filename){
  console.log('picture taken/saved', filename)
})

module.exports = photo
