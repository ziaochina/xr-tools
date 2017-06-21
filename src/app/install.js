import which from 'which'
import childProcess from 'child_process'

function runCmd(cmd, args, fn) {
  args = args || []
  var runner = childProcess.spawn(cmd, args, {
    stdio: "inherit"
  })
  runner.on('close', function(code) {
    if (fn) {
      fn(code)
    }
  })
}

var npms = ['tnpm', 'cnpm', 'npm']

function findNpm() {
  for (var i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i])
      console.log('use npm: ' + npms[i])
      return npms[i]
    } catch (e) {

    }
  }
  throw new Error('please install npm')
}

var npm = findNpm()

export default function() {
  runCmd(which.sync(npm), ['install'], function() {
    console.log(npm + ' install end')
  })
}