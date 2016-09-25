
var connect = require('connect');
var serveStatic = require('serve-static');
var port = 80;
console.log('Server listening on ' + port);
connect().use(serveStatic(__dirname)).listen(port);
