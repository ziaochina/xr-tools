'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = index;

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
function index() {
	var appFolder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';


	if (appFolder) {
		copy(appFolder, function () {
			return buildIndex(appFolder);
		});
	} else {
		buildIndex(appFolder);
	}
}

function buildIndex(appFolder) {
	var basePath = process.cwd(),
	    apps = [];

	//获取文件数组
	var findApps = function findApps(absoultePath) {
		var files = _fs2.default.readdirSync(absoultePath, function () {});
		files.forEach(function (filename) {
			var stats = _fs2.default.statSync(_path2.default.join(absoultePath, filename)
			//是文件
			);if (stats.isFile()) {
				if (filename === 'index.js') {
					var content = _fs2.default.readFileSync(_path2.default.join(absoultePath, filename), 'utf-8');
					if (/load[ ]*:[ ]*\([ ]*cb[ ]*\)/.test(content)) {
						var appName = content.match(/name[ ]*:[ ]*\"([^\"]+)\"/)[1].replace(/[\/\.-]/g, '_');
						apps.push({ name: appName, path: absoultePath });
					}
				}
			} else if (stats.isDirectory() && filename != 'node_modules') {
				findApps(_path2.default.join(absoultePath, filename));
			}
		});
	};

	findApps(basePath);

	apps.map(function (o) {
		return console.log(_path2.default.relative(o.path, basePath));
	}
	/*
 import _src from '../index.app'
 import _src_apps_about from '../apps/about/index.app'
 import _src_apps_helloWorld from '../apps/helloWorld/index.app'
 */
	);var importAppsContent = apps.map(function (o) {
		return 'import ' + o.name + ' from \'' + _path2.default.relative(_path2.default.join(o.path, 'index.js')) + '\'';
	}).join('\r\n'

	/*
 const apps = {
 	[_apps_demo.name]:_apps_demo,	
 }	
 */
	);var defineAppsContent = 'const apps = {\r\n';
	apps.map(function (o) {
		return defineAppsContent += '\t[' + o.name + '.name]:' + o.name + ',\t\n';
	});
	defineAppsContent += '}\r\n';

	var regisiterXRComponentContent = '\nimport * as xrComponents from \'xr-component\'\n\nObject.keys(xrComponents).forEach(key=>{\n\tcomponentFactory.registerComponent(key, xrComponents[key])\n})\n\t';

	var indexTemplate = _fs2.default.readFileSync(_path2.default.join(__dirname, '../../assets/index/index.template'), 'utf-8');
	var indexContent = indexTemplate.replace('${import-apps}', importAppsContent).replace('${define-apps}', defineAppsContent).replace('${regisiter-xr-component}', regisiterXRComponentContent);

	var indexFilePath = _path2.default.join(basePath, 'index.js');

	var existsIndex = _fs2.default.existsSync(indexFilePath);
	if (existsIndex) {
		_fs2.default.unlinkSync(indexFilePath);
	}
	_fs2.default.writeFileSync(indexFilePath, indexContent);

	var appLessContent = apps.map(function (o) {
		return '@import "' + _path2.default.relative(_path2.default.join(o.path, 'style.less')) + '"';
	}).join('\r\n');

	var appLessPath = _path2.default.join(basePath, 'assets', 'styles', 'apps.less');
	var existsAppLess = _fs2.default.existsSync(appLessPath);
	if (existsAppLess) {
		_fs2.default.unlinkSync(appLessPath);
	}

	_fs2.default.writeFileSync(appLessPath, appLessContent);

	console.log('OK!');
}

function copy(appFolder, cb) {
	var cwd = join(process.cwd(), appFolder);
	var appName = _path2.default.basename(cwd);
	if (_fs2.default.existsSync(_path2.default.join(cwd, 'index.js'))) {
		var content = _fs2.default.readFileSync(_path2.default.join(cwd, 'index.js'), 'utf-8');
		appName = content.match(/name[ ]*:[ ]*\"([^\"]+)\"/)[1].replace(/[\/\.]/g, '-') || appName;
	}

	var dest = join(process.cwd(), 'src', 'apps', appName);

	_vinylFs2.default.src(['**/*', '!node_modules/**/*', "!" + process.cwd() + "/**/*"], {
		cwd: cwd,
		cwdbase: true,
		dot: true
	}).pipe(template(dest)).pipe(_vinylFs2.default.dest(dest)).on('end', function () {
		cb();
	}).resume();
}

function template(dest) {
	return _through2.default.obj(function (file, enc, cb) {
		if (!file.stat.isFile()) {
			return cb();
		} else {
			this.push(file);
			cb();
		}
	});
}
module.exports = exports['default'];