var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var session = require('express-session');
var passport = require('./config/passport');


var route = require('./app/routes/index');
var app = express();
app.set('view engine','jade');
app.set('views',path.join(__dirname,'/app/views'));

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use(session({secret:'zaq1ZAQ!'}));

app.use(passport.initialize());
app.use(passport.session());


var io = require('socket.io')(app.listen(37262,function(){
			console.log('Server started on port 37262');
		})
	);
app.use('/',function(req,res,next){
	req.io = io;
	next();
});
app.use('/',route);

