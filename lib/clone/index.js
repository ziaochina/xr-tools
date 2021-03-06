'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = install;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pug = require('pug');

var _pug2 = _interopRequireDefault(_pug);

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _which = require('which');

var _which2 = _interopRequireDefault(_which);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var join = _path2.default.join,
    basename = _path2.default.basename;
function install(appName, targetFolderName) {
	npmInstall(appName, targetFolderName);
}

function npmInstall(appName, targetFolderName) {
	var npm = findNpm();

	runCmd(_which2.default.sync(npm), ['install', appName, '--save'], function () {

		cpToXR(appName, targetFolderName);

		runCmd(_which2.default.sync(npm), ['update'], function () {
			runCmd(_which2.default.sync(npm), ['uninstall', appName], function () {
				console.log('OK!');
			}, process.cwd());
		}, process.cwd());
	}, process.cwd());
}

function cpToXR(appName, targetFolderName) {
	var cwd = join(process.cwd(), 'node_modules', appName);
	var dest = join(process.cwd(), 'apps', targetFolderName);

	_vinylFs2.default.src(['**/*', '!node_modules/**/*'], {
		cwd: cwd,
		cwdbase: true,
		dot: true
	}).pipe(template(dest)).pipe(_vinylFs2.default.dest(dest)).on('end', function () {}).resume();
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

function runCmd(cmd, args, fn, cwd) {
	args = args || [];
	var runner = _child_process2.default.spawn(cmd, args, {
		stdio: "inherit",
		cwd: cwd
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