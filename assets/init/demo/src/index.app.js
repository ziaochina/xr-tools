module.exports = {
	name: 'demo-helloWorld',
	version: '0.0.1',
	description: 'demo-helloWorld',
	author: '',
	load: (cb) => {
		require.ensure([], require => {
			cb(require('./component'), require('./action'), require('./reducer'))
		}, 'demo-helloWorld')
	}
}