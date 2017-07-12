import vfs from 'vinyl-fs'
import fs from 'fs'
import through from 'through2'
import path from 'path'
import inquirer from 'inquirer'
import which from 'which'
import childProcess from 'child_process'

const {
	join,
	basename
} = path

export default function website(cmd, options) {
	createWebsite(cmd)
}

function createWebsite(websiteName) {
	var cwd = join(__dirname, '../../assets/website/websiteTemplate');
	var dest = join(process.cwd(), websiteName);
	console.log(websiteName)
	vfs.src(['**/*', '!node_modules/**/*'], {
			cwd: cwd,
			cwdbase: true,
			dot: true
		})
		.pipe(template(dest))
		.pipe(vfs.dest(dest))
		.on('end', function() {
			var replaceNameFiles = [
				path.join(dest, 'package.json'),
			]

			replaceNameFiles.forEach(o => {
				fs.writeFileSync(o, fs.readFileSync(o, 'utf-8').replace(/\$\{websiteName\}/g, websiteName))
			})

			var npm = findNpm()

			childProcess.exec(`cd ${websiteName} && npm i --save react react-dom xr-meta-engine`, (err, stdout, stderr) => {
				if (err) {
					console.error(err);
					return;
				}
				console.log(stdout);

				childProcess.exec(`cd ${websiteName} && npm i -- save-dev babel-core 
						babel-loader babel-plugin-add-module-exports 
						babel-plugin-transform-decorators-legacy
						babel-plugin-transform-runtime
						babel-preset-es2015
						babel-preset-react
						babel-preset-stage-0
						css-loader
						file-loader
						html-webpack-plugin
						less
						less-loader
						webpack
						webpack-dev-server`, (err, stdout, stderr) => {
					if (err) {
						console.error(err);
						return;
					}
					console.log(stdout);
				})
			})
		}).resume();
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