var connect = require('connect');
var directory = "/home/billchan/node_server";



connect().use(connect.static(directory)).listen(8085);

console.log('Listening on port 80.');