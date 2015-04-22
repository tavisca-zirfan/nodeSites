exports.render = function(req,res,next){
	console.log("reached controller");
	res.render('index',{name:'Zaid'});
}