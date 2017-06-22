import vfs from 'vinyl-fs'
import fs from 'fs'
import through from 'through2'
import path from 'path'
import inquirer from 'inquirer'
import install from './install'

const {
	join,
	basename
} = path

export default function init(name) {

	var cwd = join(__dirname, '../../assets/app/demo');
	var dest = join(process.cwd(), name);

	vfs.src(['**/*', '!node_modules/**/*'], {
			cwd: cwd,
			cwdbase: true,
			dot: true
		})
		.pipe(template(dest))
		.pipe(vfs.dest(dest))
		.on('end', function() {
			fs.renameSync(path.join(dest, 'gitignore'), path.join(dest, '.gitignore'));

			var replaceNameFiles = [
				path.join(dest, 'src/index.app.js'),
				path.join(dest, 'src/component.js'),
				path.join(dest, 'src/reducer.js'),
				path.join(dest, 'package.json')
			]

			replaceNameFiles.forEach(o => {
				fs.writeFileSync(o, fs.readFileSync(o, 'utf-8').replace(/\$\{name\}/g, name))
			})

		})
		.resume();
}

function template(dest) {
	return through.obj(function(file, enc, cb) {
		if (!file.stat.isFile()) {
			return cb();
		}

		console.log('Write %s', simplifyFilename(join(dest, basename(file.path))));
		this.push(file);
		cb();
	});
}

function simplifyFilename(filename) {
	return filename.replace(process.cwd(), ".");
}