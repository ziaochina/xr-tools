import fs from 'fs'
import path from 'path'
import pug from 'pug'

export default function index(appFolder = '', startAppName = 'demo-helloWorld', targetDomId = 'app') {

	const basePath = process.cwd() ,
		appPaths = []

	//获取文件数组
	const findAppPath = (readurl, name) => {
		var name = name;
		var files = fs.readdirSync(readurl, () => {})
		files.forEach(filename => {
			var stats = fs.statSync(path.join(readurl, filename))
				//是文件
			if (stats.isFile()) {
				if (filename === 'index.js'){
					let content = fs.readFileSync(path.join(readurl, filename), 'utf-8')
					if(/load[ ]*:[ ]*\([ ]*cb[ ]*\)/.test(content)){
						appPaths.push(name)	
					}
					
				}
			} else if (stats.isDirectory() && filename != 'node_modules') {
				var dirName = filename;
				findAppPath(path.join(readurl, filename), name + '/' + dirName);
			}
		})
	}

	findAppPath(path.join(basePath, appFolder), appFolder ? appFolder : '.')

	/*
	import _src from '../index.app'
	import _src_apps_about from '../apps/about/index.app'
	import _src_apps_helloWorld from '../apps/helloWorld/index.app'
	*/
	var appNames = appPaths.map(o=> o.replace(/[\/\.-]/g,''))
	var importAppsContent = appPaths.map(o => `import ${o.replace(/[\/\.-]/g,'')} from '${o}/index'`).join('\r\n')

	/*
	const apps = {
		[_apps_demo.name]:_apps_demo,	
	}	
	*/
	var defineAppsContent = 'const apps = {\r\n'
	appNames.map(o=>defineAppsContent+=`\t[${o}.name]:${o},\t\n`)
	defineAppsContent += '}\r\n'
	
	
	var regisiterXRComponentContent = `
import * as xrComponents from 'xr-component'

Object.keys(xrComponents).forEach(key=>{
	componentFactory.registerComponent(key, xrComponents[key])
})
	`

	var indexTemplate = fs.readFileSync(path.join(__dirname, '../../assets/index/index.template'), 'utf-8');
	var indexContent = indexTemplate
		.replace('${import-apps}', importAppsContent)
		.replace('${define-apps}', defineAppsContent)
		.replace('${regisiter-xr-component}', regisiterXRComponentContent)

	var existsIndex = fs.existsSync(path.join(basePath, 'index.js'))
	if (existsIndex) {
		fs.unlinkSync(path.join(basePath, 'index.js'))
	}
	console.log(path.join(basePath, 'index.js'))
	fs.writeFileSync(path.join(basePath, 'index.js'), indexContent)
}