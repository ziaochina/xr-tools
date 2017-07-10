import { config, start, componentFactory } from 'xr-meta-engine'
import myConfig  from './config'

import _src_apps_app_demo from './src/apps/app-demo/index'

const apps = {
	[_src_apps_app_demo.name]:_src_apps_app_demo,	
}


config(myConfig({apps}))


import * as xrComponents from 'xr-component'

Object.keys(xrComponents).forEach(key=>{
	componentFactory.registerComponent(key, xrComponents[key])
})
	

start()