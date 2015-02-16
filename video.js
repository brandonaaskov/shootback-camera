var exec = require('child_process').exec,
    through = require('through')

var getFilename = function () {
  return 'videos/file-' + Date.now() + '.h264'
}

var video = {
  start: function () {
    var flags = [
      '-c', // record to circular buffer
      //'-k', // end buffer and save on keystroke
      '-s', // end buffer and save on signal
      '-o ' + getFilename() // output
    ]

    //var checkBuffer = through(function (data) {
    //  console.log('checking buffer', data)
    //  this.queue(data)
    //})

    var command = 'raspivid ' + flags.join(' ')
    var options = {
      maxBuffer: 200*1024,
      callback: function () {
        console.log('exec process terminated')
      }
    }

    var raspivid = exec(command, options)
    setTimeout(function () {
      console.log('sending signal', raspivid.pid)
      raspivid.kill('SIGUSR1')
    }, 3000)
  }
}

module.exports = video
