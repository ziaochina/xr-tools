import vfs from 'vinyl-fs'
import fs from 'fs'
import through from 'through2'
import path from 'path'
import inquirer from 'inquirer'
import which from 'which'
import childProcess from 'child_process'
import pug from 'pug'

const { join, basename } = path

export default function app(cmd, options) {
	if(options.init){
		var appName = cmd || path.basename(process.cwd())
		createApp(appName,process.cwd())
	}else{
		createApp(cmd, join(process.cwd(), cmd))	
	}
}


function createApp(appName, dest){
	var cwd = join(__dirname, '../../assets/app/appTemplate')
	vfs.src(['**/*', '!node_modules/**/*'], {
			cwd: cwd,
			cwdbase: true,
			dot: true
		})
		.pipe(template(dest))
		.pipe(vfs.dest(dest))
		.on('end', function() {
			var replaceNameFiles = [
				path.join(dest, 'index.js'),
			]

			replaceNameFiles.forEach(o => {
				fs.writeFileSync(o, fs.readFileSync(o, 'utf-8').replace(/\$\{appName\}/g, appName))
			})
				
		})
		.resume();
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



/*
var npm = findNpm()
	//runCmd(which.sync('cd'), [appName], function () {})
	runCmd(which.sync(npm), ['install', 'react', 'react-dom', 'xr-meta-engine', '--save'], function () {	console.log(npm + ' install --save end');})

	runCmd(which.sync(npm), [
		'install', 
		'babel-core', 
		'babel-loader', 
		'babel-plugin-add-module-exports',
		'babel-plugin-transform-decorators-legacy',
		'babel-plugin-transform-runtime',
		'babel-preset-es2015',
		'babel-preset-react',
		'babel-preset-stage-0',
		'css-loader',
		'file-loader',
		'html-webpack-plugin',
		'less',
		'less-loader',
		'style-loader',
		'webpack',
		'webpack-dev-server',
		 '--save-dev'], function () {
		 	console.log(npm + ' install --save-dev end');
		 })

*/