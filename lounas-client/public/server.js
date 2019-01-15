console.log('Start lounas-keilaniemi');

const PORT = process.env.PORT || 8080; 
const connect = require('connect')
const serveStatic = require('serve-static')

var app = connect()
	.use(function(res,req,next) {
		
		if(res.url != '/server.js') {
			next();	
		}
		
	})
    .use(serveStatic('./'))
	.listen(PORT);

console.log('listening: '+PORT);