import vfs from 'vinyl-fs'
import fs from 'fs'
import through from 'through2'
import path from 'path'
import inquirer from 'inquirer'
import which from 'which'
import childProcess from 'child_process'

const { join, basename } = path

export default function app(cmd, options) {
	createApp(cmd)
}

function createApp(appName){
	var cwd = join(__dirname, '../../assets/app/appTemplate');
	var dest = join(process.cwd(), appName);

	vfs.src(['**/*', '!node_modules/**/*'], {
			cwd: cwd,
			cwdbase: true,
			dot: true
		})
		.pipe(template(dest))
		.pipe(vfs.dest(dest))
		.resume();

	var npm = findNpm()
	childProcess.exec('cd '+ appName)
	runCmd(which.sync('ls'), [], function () {})

	//runCmd(which.sync('cd'), [appName], function () {})
	//runCmd(which.sync(npm), ['install', 'react', '--save'], function () {})
}


function template(dest) {
	return through.obj(function(file, enc, cb) {
		if (!file.stat.isFile()) {
			return cb();
		}

		console.log('Write %s', simplifyFilename(join(dest, basename(file.path))));
		this.push(file);
		cb();
	});
}

function simplifyFilename(filename) {
	return filename.replace(process.cwd(), ".");
}

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



