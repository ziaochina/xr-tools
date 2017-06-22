import React, {
	Component
} from 'react'

export default class ${name}Component extends Component {

	componentDidMount() {
		this.props.initView()
	}

	render() {
		//this.props中包含所以action export的方法,以及payload当前这个app的state
		if (this.props.payload)
			return (<div>{this.props.payload.get('text')}</div>)
		else
			return null
	}
}