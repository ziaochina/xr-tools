'use strict';

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

runCmd(_which2.default.sync(npm), ['install'], function () {
  console.log(npm + ' install end');
  console.log();
  console.log('---');
  console.log();
  console.log('antd-init@2 仅适用于学习和体验 antd，如果你要开发项目，推荐使用 dva-cli 进行项目初始化。dva 是一个基于 react 和 redux 的轻量应用框架，概念来自 elm，支持 side effects、热替换、动态加载等，已在生产环境广泛应用。');
  console.log('antd-init@2 is only for experience antd. If you want to create projects, it\'s better to init with dva-cli. dva is a redux and react based application framework. elm concept, support side effects, hmr, dynamic load and so on.');
  console.log();
  console.log('Usage:');
  console.log();
  console.log('npm install dva-cli -g');
  console.log('dva new myapp');
  console.log('cd myapp');
  console.log('npm start');
  console.log();
  console.log('Visit https://github.com/dvajs/dva to learn more.');
});