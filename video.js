var exec = require('child_process').exec,
    through = require('through')

var getFilename = function () {
  return 'videos/file-' + Date.now() + '.h264'
}

var video = {
  start: function () {
    var onVideoSaved = function (error, stdout, stderr) {
      console.log('video saved')
    }

    var flags = [
      '-c', // record to circular buffer
      '-k', // end buffer and save on keystroke
      '-o ' + getFilename() // output
    ]

    var checkBuffer = through(function (data) {
      console.log('checking buffer', data)
      this.queue(data)
    })

    var command = 'raspivid ' + flags.join(' ')
    exec(command, onVideoSaved).pipe(checkBuffer)
  }
}

module.exports = video
