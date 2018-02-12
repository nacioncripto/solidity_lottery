const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const contractsPath = path.resolve(__dirname, 'contracts');
console.log('Source folder: ' + contractsPath)

const files = fs.readdirSync(contractsPath);

const filelist = [];

files.forEach(function(file) {
	const fullFile = path.join(contractsPath, file);
	if (!fs.statSync(fullFile).isDirectory()) {
		const extensionIndex = file.indexOf('.sol');
		const extensionPosition = file.length - 4;
		if ( extensionIndex == extensionPosition ) {
			filelist.push(fullFile);
		}
	}
});
console.log('Contracts found: ' + filelist.length + ' - [' + filelist + ']');


const buildPath = path.resolve(__dirname, 'build');
fs.ensureDirSync(buildPath);
console.log('Building folder: ' + buildPath)
fs.removeSync(buildPath);
console.log('Cleaning build folder.')

filelist.forEach(function(file) {
	console.log(file);	
	const contractFile = path.resolve(file);
	const contractSource = fs.readFileSync( contractFile, 'utf8');	
	console.log('Compiling contract ' + contractFile)
	const output = solc.compile(contractSource, 1).contracts;

	for(let contract in output){
		fs.outputJsonSync(
			path.resolve(buildPath, contract.replace(':', '') + '.json'),
			output[contract]
		);
	}
});