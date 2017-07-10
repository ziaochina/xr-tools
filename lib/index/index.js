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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function index() {
	var appFolder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	var startAppName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'demo-helloWorld';
	var targetDomId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'app';


	var basePath = process.cwd() + appFolder,
	    appPaths = [];

	//获取文件数组
	var findAppPath = function findAppPath(readurl, name) {
		var name = name;
		var files = _fs2.default.readdirSync(readurl, function () {});
		files.forEach(function (filename) {
			var stats = _fs2.default.statSync(_path2.default.join(readurl, filename)
			//是文件
			);if (stats.isFile()) {
				if (filename === 'index.js') {
					var content = _fs2.default.readFileSync(_path2.default.join(readurl, filename), 'utf-8');
					if (/load[ ]*:[ ]*\([ ]*cb[ ]*\)/.test(content)) {
						appPaths.push(name);
					}
				}
			} else if (stats.isDirectory() && filename != 'node_modules') {
				var dirName = filename;
				findAppPath(_path2.default.join(readurl, filename), name + '/' + dirName);
			}
		});
	};

	findAppPath(basePath, appFolder ? appFolder : '.'

	/*
 import _src from '../index.app'
 import _src_apps_about from '../apps/about/index.app'
 import _src_apps_helloWorld from '../apps/helloWorld/index.app'
 */
	);var appNames = appPaths.map(function (o) {
		return o.replace(/[\/\.-]/g, '');
	});
	var importAppsContent = appPaths.map(function (o) {
		return 'import ' + o.replace(/[\/\.-]/g, '') + ' from \'' + o + '/index\'';
	}).join('\r\n'

	/*
 const apps = {
 	[_apps_demo.name]:_apps_demo,	
 }	
 */
	);var defineAppsContent = 'const apps = {\r\n';
	appNames.map(function (o) {
		return defineAppsContent += '\t[' + o + '.name]:' + o + ',\t\n';
	});
	defineAppsContent += '}\r\n';

	var regisiterXRComponentContent = '\nimport * as xrComponents from \'xr-component\'\n\nObject.keys(xrComponents).forEach(key=>{\n\tcomponentFactory.registerComponent(key, xrComponents[key])\n})\n\t';

	var indexTemplate = _fs2.default.readFileSync(_path2.default.join(__dirname, '../../assets/index/index.template'), 'utf-8');
	var indexContent = indexTemplate.replace('${import-apps}', importAppsContent).replace('${define-apps}', defineAppsContent).replace('${regisiter-xr-component}', regisiterXRComponentContent);

	var existsIndex = _fs2.default.existsSync(_path2.default.join(basePath, 'index.js'));
	if (existsIndex) {
		_fs2.default.unlinkSync(_path2.default.join(basePath, 'index.js'));
	}
	console.log(_path2.default.join(basePath, 'index.js'));
	_fs2.default.writeFileSync(_path2.default.join(basePath, 'index.js'), indexContent);
}
module.exports = exports['default'];