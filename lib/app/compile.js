'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = compile;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compile() {
	var startAppName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'demo-helloWorld';
	var targetDomId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'app';


	var basePath = process.cwd(),
	    appPaths = [];

	//获取文件数组
	var findAppPath = function findAppPath(readurl, name) {
		var name = name;
		var files = _fs2.default.readdirSync(readurl, function () {});
		files.forEach(function (filename) {
			var stats = _fs2.default.statSync(_path2.default.join(readurl, filename)
			//是文件
			);if (stats.isFile()) {
				if (filename === 'index.app.js') appPaths.push(name);
			} else if (stats.isDirectory() && filename != 'node_modules') {
				var dirName = filename;
				findAppPath(_path2.default.join(readurl, filename), name + '/' + dirName);
			}
		});
	};

	findAppPath(basePath, '.');

	var importAppsContent = appPaths.map(function (o) {
		return 'import ' + o.replace(/\./g, '').replace(/\//g, '_') + ' from \'' + o + '/index.app\'';
	}).join('\r\n');

	var configAppsContent = 'config({\r\n\tapps: {\r\n';
	configAppsContent += appPaths.map(function (o) {
		var a = o.replace(/\./g, '').replace(/\//g, '_');
		return '\t\t[' + a + '.name]: ' + a;
	}).join(',\r\n');
	configAppsContent += '\r\n\t}\r\n})';

	var indexTemplate = _fs2.default.readFileSync('../../assets/app/index.template', 'utf-8');

	var indexContent = indexTemplate.replace('${import-apps}', importAppsContent).replace('${config-apps}', configAppsContent).replace('${start-app-name}', startAppName).replace('${target-dom-id}', targetDomId);

	var existsIndex = _fs2.default.existsSync(_path2.default.join(basePath, 'index.js'));
	if (existsIndex) {
		_fs2.default.unlinkSync(_path2.default.join(basePath, 'index.js'));
	}
	_fs2.default.writeFileSync(_path2.default.join(basePath, 'index.js'), indexContent);
}
module.exports = exports['default'];