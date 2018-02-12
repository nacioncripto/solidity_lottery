// keys.js - figure out what set of credentials to return.
if (process.env.NODE_ENV == 'production') {
	// we are in production - return the prod set of keys.
	console.log('production');
	module.exports = require('./rinkeby');
} else {
	// we are in development - return the dev keys.
	console.log('dev');
	module.exports = require('./dev');
}
