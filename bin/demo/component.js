import React, { Component } from 'react'

import { wrapper } from 'xr-meta-engine'

import appInfo from './index'

@wrapper(appInfo)
export default class Component extends Component {
	render() {
		return  this.props.monkeyKing({...this.props, path:'root'})
	}
}