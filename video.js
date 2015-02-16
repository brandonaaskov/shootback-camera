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
      '-o -' // buffer to stdout
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

    var onVideoSaved = function (error, stdout, stderr) {
      console.log('video saved', stdout)
    }

    var raspivid = exec(command, options, onVideoSaved)
    raspivid.stdout.on('data', function (data) {
      console.log('data?', data)
    })

    setTimeout(function () {
      console.log('sending signal', raspivid.pid)
      raspivid.kill()
    }, 2000)
  }
}

module.exports = video
