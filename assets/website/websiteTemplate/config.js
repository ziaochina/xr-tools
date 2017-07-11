var _options

function config(options) {
	_options = options
	_options.targetDomId = 'app'
	_options.startAppName = 'app-demo'
	//options.apps['appname'].config({key:value})

	return _options
}

config.getCurrent = () => _options

export default config