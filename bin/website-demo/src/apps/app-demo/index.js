import config from './config'
import * as api from './api'

export default {
	name: "app-demo",
	version:"1.0.0",
	description:"app-demo",
	meta : api.getMeta(),
	components:[],
	config:config,
	load: (cb) => {
		require.ensure([], require => {
			cb(require('./component'), require('./action'), require('./reducer'))
		}, "app-demo")
	}
}