'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = app;

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _compile = require('./compile');

var _compile2 = _interopRequireDefault(_compile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function app(options) {
	if (options.init) {
		(0, _init2.default)(options.init);
	}

	if (options.compile) {
		(0, _compile2.default)(options['startAppName'], options['targetDomId']);
	}
}
module.exports = exports['default'];