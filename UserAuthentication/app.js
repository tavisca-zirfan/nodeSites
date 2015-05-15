var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('./config/passport');
var flash = require('connect-flash');
var route = require('./app/routes/index');
var user = require('./app/routes/user');
var post = require('./app/routes/post');
var profile = require('./app/routes/profile');
var chatController = require('./app/controllers/chatController');
var multer = require('multer');
var fs = require('fs');
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({secret:'zaidisawesome'}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({
	dest:'./public/uploads',
	rename:function(fieldname,filename,req,res){
		return fieldname + filename + Date.now()
	},
	changeDest:function(dest,req,res){
		var stat = null;
		var finalPath = dest+'/'+req.user._id;
		  try {
		      // using fs.statSync; NOTE that fs.existsSync is now deprecated; fs.accessSync could be used but is only nodejs >= v0.12.0
		      stat = fs.statSync(finalPath);
		  } catch(err) {
		      // for nested folders, look at npm package "mkdirp"
		      fs.mkdirSync(finalPath);
		  }

		  if (stat && !stat.isDirectory()) {
		      // Woh! This file/link/etc already exists, so isn't a directory. Can't save in it. Handle appropriately.
		      throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
		  }
		  return finalPath;
	},
	onFileUploadComplete:function(file,req,res){
		console.log(file.fieldname+' uploaded to '+file.path);
	},
	onFileUploadStart:function(file,req,res){
		return req.isAuthenticated();
	}
}));
app.set('view engine','jade');
app.set('views',path.join(__dirname,'app/views'));
app.use(express.static(__dirname+'/public'));
var io = require('socket.io')(app.listen(37261,function(){
			console.log('Server started on port 37261');
		})
	);
app.use('/',function(req,res,next){
	req.io = io;
	chatController(req);
	next();
});
app.use('/',route);
app.use('/',user);
app.use('/',profile);
app.use('/',post);
