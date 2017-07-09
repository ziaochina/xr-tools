import pa from './package.json'
import config from './config'
import * api from './api'

export default {
	name: pa.name,
	version:pa.version,
	description:pa.description,
	meta : api.getMeta(),
	load: (cb) => {
		require.ensure([], require => {
			cb(require('./component'), require('./action'), require('./reducer'))
		}, 'example')
	}
}