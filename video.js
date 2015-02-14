var spawn = require('child_process').spawn,
    through = require('through')

var getFilename = function () {
  return 'videos/file-' + Date.now() + '.h264'
}

var video = {
  start: function () {
    var flags = [
      '-c', // record to circular buffer
      '-k', // end buffer and save on keystroke
      '-o ' + getFilename() // output
    ]

    //var checkBuffer = through(function (data) {
    //  console.log('checking buffer', data)
    //  this.queue(data)
    //})

    var raspivid = spawn('raspivid', flags)
    raspivid.on('data', function () {
      console.log('data stream', arguments)
    })
  }
}

module.exports = video
