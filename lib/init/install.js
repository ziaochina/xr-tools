'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  runCmd(_which2.default.sync(npm), ['install'], function () {
    console.log(npm + ' install end');
  });
};

var _which = require('which');

var _which2 = _interopRequireDefault(_which);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var npm = findNpm();

module.exports = exports['default'];