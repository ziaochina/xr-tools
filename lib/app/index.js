'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = app;

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _which = require('which');

var _which2 = _interopRequireDefault(_which);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _pug = require('pug');

var _pug2 = _interopRequireDefault(_pug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var join = _path2.default.join,
    basename = _path2.default.basename;
function app(cmd, options) {
	if (options.init) {
		var appName = cmd || _path2.default.basename(process.cwd());
		createApp(appName, process.cwd());
	} else {
		createApp(cmd, join(process.cwd(), cmd));
	}
}

function createApp(appName, dest) {
	var cwd = join(__dirname, '../../assets/app/appTemplate');
	_vinylFs2.default.src(['**/*', '!node_modules/**/*'], {
		cwd: cwd,
		cwdbase: true,
		dot: true
	}).pipe(template(dest)).pipe(_vinylFs2.default.dest(dest)).on('end', function () {
		var replaceNameFiles = [_path2.default.join(dest, 'index.js'), _path2.default.join(dest, 'style.less')];

		replaceNameFiles.forEach(function (o) {
			_fs2.default.writeFileSync(o, _fs2.default.readFileSync(o, 'utf-8').replace(/\$\{appName\}/g, appName));
		});

		console.log('OK!');
	}).resume();
}

function template(dest) {
	return _through2.default.obj(function (file, enc, cb) {
		if (!file.stat.isFile()) {
			return cb();
		}
		this.push(file);
		cb();
	});
}

function simplifyFilename(filename) {
	return filename.replace(process.cwd(), ".");
}

function runCmd(cmd, args, fn) {
	args = args || [];
	var runner = _child_process2.default.spawn(cmd, args, {
		stdio: "inherit"
	});
	runner.on('close', function (code) {
		if (fn) {
			fn(code);
		}
	});
}

var npms = ['tnpm', 'cnpm', 'npm'];

function findNpm() {
	for (var i = 0; i < npms.length; i++) {
		try {
			_which2.default.sync(npms[i]);
			console.log('use npm: ' + npms[i]);
			return npms[i];
		} catch (e) {}
	}
	throw new Error('please install npm');
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

module.exports = exports['default'];