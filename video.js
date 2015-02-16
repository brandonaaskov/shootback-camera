var exec = require('child_process').exec,
    through = require('through')

var getFilename = function () {
  return 'videos/file-' + Date.now() + '.h264'
}

var video = {
  start: function () {
    var flags = [
      '-c', // record to circular buffer
      '-s', // end buffer and save on signal
      '-o ' + getFilename() // output
    ]

    //var checkBuffer = through(function (data) {
    //  console.log('checking buffer', data)
    //  this.queue(data)
    //})

    var command = 'raspivid ' + flags.join(' ')
    console.log('command', command)
    var options = {
      killSignal: 'SIGUSR1',
      maxBuffer: 200*1024
    }

    var onVideoSaved = function () {
      console.log('video saved', arguments)
    }

    var raspivid = exec(command, options, onVideoSaved)
    setTimeout(function () {
      console.log('sending signal', raspivid.pid)
      raspivid.kill()
    }, 5000)
  }
}

module.exports = video
