import init from './init'
import compile from './compile'

export default function app(options) {
	if (options.init) {
		init(options.init)
	}

	if (options.compile) {
		compile()
	}
}