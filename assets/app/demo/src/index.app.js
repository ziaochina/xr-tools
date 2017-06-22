module.exports = {
	name: '${name}',
	version: '0.0.1',
	description: '${name}',
	author: '',
	load: (cb) => {
		require.ensure([], require => {
			cb(require('./component'), require('./action'), require('./reducer'))
		}, '${name}')
	}
}