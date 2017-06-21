import fs from 'fs'
import path from 'path'

export default function compile(startAppName = 'demo-helloWorld', targetDomId = 'app') {

	const basePath = process.cwd(),
		appPaths = []

	//获取文件数组
	const findAppPath = (readurl, name) => {
		var name = name;
		var files = fs.readdirSync(readurl, () => {})
		files.forEach(filename => {
			var stats = fs.statSync(path.join(readurl, filename))
				//是文件
			if (stats.isFile()) {
				if (filename === 'index.app.js')
					appPaths.push(name)
			} else if (stats.isDirectory() && filename != 'node_modules') {
				var dirName = filename;
				findAppPath(path.join(readurl, filename), name + '/' + dirName);
			}
		})
	}

	findAppPath(basePath, '.')

	var importAppsContent = appPaths.map(o => `import ${o.replace(/\./g,'').replace(/\//g,'_')} from '${o}/index.app'`).join('\r\n')

	var configAppsContent = `config({\r\n\tapps: {\r\n`
	configAppsContent += appPaths.map(o => {
		let a = o.replace(/\./g, '').replace(/\//g, '_')
		return `\t\t[${a}.name]: ${a}`
	}).join(',\r\n')
	configAppsContent += '\r\n\t}\r\n})'

	var indexTemplate = fs.readFileSync('../../assets/app/index.template',
		'utf-8');

	var indexContent = indexTemplate
		.replace('${import-apps}', importAppsContent)
		.replace('${config-apps}', configAppsContent)
		.replace('${start-app-name}', startAppName)
		.replace('${target-dom-id}', targetDomId)


	var existsIndex = fs.existsSync(path.join(basePath, 'index.js'))
	if (existsIndex) {
		fs.unlinkSync(path.join(basePath, 'index.js'))
	}
	fs.writeFileSync(path.join(basePath, 'index.js'), indexContent)
}