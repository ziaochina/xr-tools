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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var join = _path2.default.join,
    basename = _path2.default.basename;
function app(cmd, options) {
		createApp(cmd);
}

function createApp(appName) {
		var cwd = join(__dirname, '../../assets/app/appTemplate');
		var dest = join(process.cwd(), appName);

		_vinylFs2.default.src(['**/*', '!node_modules/**/*'], {
				cwd: cwd,
				cwdbase: true,
				dot: true
		}).pipe(template(dest)).pipe(_vinylFs2.default.dest(dest)).resume();

		var npm = findNpm();
		_child_process2.default.exec('cd ' + appName);
		runCmd(_which2.default.sync('ls'), [], function () {}

		//runCmd(which.sync('cd'), [appName], function () {})
		//runCmd(which.sync(npm), ['install', 'react', '--save'], function () {})
		);
}

function template(dest) {
		return _through2.default.obj(function (file, enc, cb) {
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
module.exports = exports['default'];