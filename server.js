// server.js
const {createServer} = require('http');
const next = require('next');

const app = next({dev: process.env.NODE_ENV !== 'production'})

const routes = require('./routes')
const handler = routes.getRequestHandler(app)

const PORT = process.env.PORT || 4537;

// Without express
app.prepare().then(() => {
  createServer(handler).listen(PORT, (err) => {
      if(err) throw err;
      console.log('Ready on localhost:' + PORT);
  } );
})