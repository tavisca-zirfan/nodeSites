var express = require('express');
var route = express.Router();
var pollController = require('../controllers/pollController');
var _ = require('underscore');

route.get('/poll/',isAuthenticated,function(req,res){
	res.render('poll',{user:req.user,sidebarNotRequired:false});
});

route.get('/api/poll/',isAuthenticated,function(req,res){
	var filter = {};	
	pollController.get(req.user,filter,function(polls,error){
		if(error){
			res.status(302).send(error);
		}
		var results = [];
			_.each(polls,function(poll){
				results.push(poll.results);
			})
		res.status(200).send(results);
	});

});

route.get('/api/poll/:id',isAuthenticated,function(req,res){
	pollController.getById(req.user,req.params.id,function(poll,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(poll.results);
	});
});

route.post('/api/poll/',isAuthenticated,function(req,res){
	pollController.create(req.user,req.body,function(poll,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(poll);
	});
});

route.delete('/api/poll/:id',isAuthenticated,function(req,res){
	pollController.delete(req.user,req.params.id,function(response,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send({success:true});
	});
});

route.post('/api/poll/:id/votes',isAuthenticated,function(req,res){
	pollController.addVote(req.user,req.params.id,req.body.votes,function(response,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(response.results);
	});
});



function isAuthenticated(req,res,next){
	if(req.isAuthenticated())
		return next();	
	res.redirect('/login');
}

module.exports = route;