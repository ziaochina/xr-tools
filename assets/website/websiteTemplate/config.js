var _options

function config(options) {
	_options = options
	_options.targetDomId = 'app'
	_options.startAppName = 'app-demo'
	Object.keys(options.apps).forEach(key=>{
		options.apps[key].config()
	})

	return _options
}

config.getCurrent = () => _options

export default config