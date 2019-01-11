console.log('Start lounas-keilaniemi');

const PORT = process.env.PORT || 8080; 
const connect = require('connect')
const serveStatic = require('serve-static')

var app = connect()
    .use(serveStatic('./'))
    .listen(PORT)

console.log('listening: '+PORT);