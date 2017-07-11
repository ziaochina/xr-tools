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
function install(appName) {
	npmInstall(appName);
}

function npmInstall(appName) {
	var npm = findNpm();

	runCmd(_which2.default.sync(npm), ['install', appName], function () {
		cpToXR(appName);
	}, process.cwd());
}

function cpToXR(appName) {
	var cwd = join(process.cwd(), 'node_modules', appName);
	var appName = _path2.default.basename(cwd);
	if (_fs2.default.existsSync(_path2.default.join(cwd, 'index.js'))) {
		var content = _fs2.default.readFileSync(_path2.default.join(cwd, 'index.js'), 'utf-8');
		appName = content.match(/name[ ]*:[ ]*\"([^\"]+)\"/)[1].replace(/[\/\.]/g, '-') || appName;
	}

	var dest = join(process.cwd(), 'xr_apps');

	_vinylFs2.default.src(['**/*', '!node_modules/**/*'], {
		cwd: cwd,
		cwdbase: true,
		dot: true
	}).pipe(template(dest)).pipe(_vinylFs2.default.dest(dest)).on('end', function () {
		cb();
	}).resume();
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