import fs from 'fs'
import path from 'path'
import pug from 'pug'
import vfs from 'vinyl-fs'
import through from 'through2'
import inquirer from 'inquirer'
import which from 'which'
import childProcess from 'child_process'

const { join, basename } = path

export default function install(appName) {
	npmInstall(appName)
}

function npmInstall(appName){
	var npm = findNpm()

	runCmd(which.sync(npm), ['install', appName], function(){
		cpToXR(appName)
	},process.cwd())
}

function cpToXR(appName){
	var cwd = join(process.cwd(), 'node_modules', appName)
	var appName = path.basename(cwd)
	if(fs.existsSync(path.join(cwd, 'index.js'))){
		var content = fs.readFileSync(path.join(cwd, 'index.js'), 'utf-8')
		appName =  content.match( /name[ ]*:[ ]*\"([^\"]+)\"/)[1].replace(/[\/\.]/g,'-') || appName
	}
	
	var dest = join(process.cwd(), 'xr_apps')

	vfs.src(['**/*', '!node_modules/**/*'], {
		cwd: cwd,
		cwdbase: true,
		dot: true
	})
		.pipe(template(dest))
		.pipe(vfs.dest(dest))
		.on('end', function () {
			cb()
		})
		.resume();
}

function template(dest) {
	return through.obj(function (file, enc, cb) {
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



function runCmd(cmd, args, fn, cwd) {
	args = args || []
	var runner = childProcess.spawn(cmd, args, {
		stdio: "inherit",
		cwd:cwd
	})
	runner.on('close', function (code) {
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