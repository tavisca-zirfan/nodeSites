var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('./config/passport');
var flash = require('connect-flash');
var route = require('./app/routes/index');
var user = require('./app/routes/user');
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({secret:'zaidisawesome'}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine','jade');
app.set('views',path.join(__dirname,'app/views'));
app.use('/',route);
app.use('/',user);
app.listen(37261,function(){
	console.log('Server Started');
});