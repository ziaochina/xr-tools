'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = website;

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
function website(cmd, options) {
	if (options.init) {
		var websiteName = cmd || _path2.default.basename(process.cwd());
		createWebsite(websiteName, process.cwd());
	} else {
		createWebsite(cmd, join(process.cwd(), cmd));
	}
}

function createWebsite(websiteName, dest) {
	var cwd = join(__dirname, '../../assets/website/websiteTemplate');
	_vinylFs2.default.src(['**/*', '!node_modules/**/*'], {
		cwd: cwd,
		cwdbase: true,
		dot: true
	}).pipe(template(dest)).pipe(_vinylFs2.default.dest(dest)).on('end', function () {
		var replaceNameFiles = [_path2.default.join(dest, 'package.json')];

		replaceNameFiles.forEach(function (o) {
			_fs2.default.writeFileSync(o, _fs2.default.readFileSync(o, 'utf-8').replace(/\$\{websiteName\}/g, websiteName));
		});

		var npm = findNpm();

		runCmd(_which2.default.sync(npm), ['install', 'react', 'react-dom', 'xr-meta-engine', 'xr-component', '--save'], function () {
			console.log(npm + ' install --save end');
		}, dest);
		runCmd(_which2.default.sync(npm), ['install', 'babel-core', 'babel-loader', 'babel-plugin-add-module-exports', 'babel-plugin-transform-decorators-legacy', 'babel-plugin-transform-runtime', 'babel-preset-es2015', 'babel-preset-react', 'babel-preset-stage-0', 'css-loader', 'file-loader', 'html-webpack-plugin', 'less', 'less-loader', 'style-loader', 'webpack', 'webpack-dev-server', '--save-dev'], function () {
			console.log(npm + ' install --save-dev end');
		}, dest);
	}).resume();
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