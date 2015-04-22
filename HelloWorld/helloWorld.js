var app = require('http');
app.createServer(function(req,res){
	res.writeHead('200',{
		'Content-Type':'text/plain'
	});
	res.end('Hello world!');
}).listen(1337)