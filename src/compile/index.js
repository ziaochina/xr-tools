import fs from 'fs'
import path from 'path'
import pug from 'pug'
import vfs from 'vinyl-fs'
import through from 'through2'
import inquirer from 'inquirer'
import which from 'which'
import childProcess from 'child_process'

const { join, basename } = path

export default function index(appFolder = '') {

	if(appFolder){
		copy(appFolder, ()=> buildIndex(appFolder))
	}
	else{
		buildIndex(appFolder)
	}


}

function buildIndex(appFolder) {
		const basePath = process.cwd(),
		apps = []

	//获取文件数组
	const findApps = (absoultePath, relaPath) => {
		var files = fs.readdirSync(absoultePath, () => {})
		files.forEach(filename => {
			var stats = fs.statSync(path.join(absoultePath, filename))
				//是文件
			if (stats.isFile()) {
				if (filename === 'index.js'){
					let content = fs.readFileSync(path.join(absoultePath, filename), 'utf-8')
					if(/load[ ]*:[ ]*\([ ]*cb[ ]*\)/.test(content)){
						let appName = content.match( /name[ ]*:[ ]*\"([^\"]+)\"/)[1].replace(/[\/\.-]/g,'_')
						apps.push({name:appName, path:`${relaPath}/${filename}`})
					}
					
				}
			} else if (stats.isDirectory() && filename != 'node_modules') {
				var dirName = filename;
				findApps(path.join(absoultePath, filename), `${relaPath}/${dirName}`)
			}
		})
	}

	findApps(basePath, '.')

	/*
	import _src from '../index.app'
	import _src_apps_about from '../apps/about/index.app'
	import _src_apps_helloWorld from '../apps/helloWorld/index.app'
	*/
	var importAppsContent = apps.map(o => `import ${o.name} from '${o.path}'`).join('\r\n')

	/*
	const apps = {
		[_apps_demo.name]:_apps_demo,	
	}	
	*/
	var defineAppsContent = 'const apps = {\r\n'
	apps.map(o=>defineAppsContent+=`\t[${o.name}.name]:${o.name},\t\n`)
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

	var indexFilePath = path.join(basePath, 'index.js')

	var existsIndex = fs.existsSync(indexFilePath)
	if (existsIndex) {
		fs.unlinkSync(indexFilePath)
	}
	console.log(indexFilePath)
	fs.writeFileSync(indexFilePath, indexContent)
}


function copy(appFolder, cb) {
	var cwd = join(process.cwd(), appFolder)
	var dest = join(process.cwd(), 'src', 'apps', path.basename(cwd))

	vfs.src(['**/*', '!node_modules/**/*', "!" + process.cwd() + "/**/*"], {
		cwd: cwd,
		cwdbase: true,
		dot: true
	})
		.pipe(template(dest))
		.pipe(vfs.dest(dest))
		.on('end', function () {
			cb()
		})
		.resume();
}




function template(dest) {
	return through.obj(function (file, enc, cb) {
		if (!file.stat.isFile()) {
			return cb();
		}else{
			this.push(file);
			cb();
		}
	});
}
