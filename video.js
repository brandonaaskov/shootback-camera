var RaspiCam = require('raspicam')
var exec = require('child_process').exec

//var video = new RaspiCam({
//  mode: 'video',
//  output: './videos/file-' + Date.now() + '.mov',
//  c: ''
//})
//
//video.on('read', function(err, timestamp, filename){
//  console.log('video saved', filename)
//})
//
//video.on('data', function(data) {
//  console.log('video data buffer', data)
//})

var video = {
  start: function () {
    var onVideoBuffer = function (error, stdout, stderr) {
      console.log('video buffer')
    }
    exec('raspivid -o ./videos/test.mov', onVideoBuffer)
  }
}

module.exports = video
