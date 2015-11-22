var mongoose = require('mongoose'),
	Article = mongoose.model('Article');

// gets the mongoose error opbject passed as an argument then iterates over the errors collection and extract the first message
// prevents multiple error messages at once 
var getErrorMessage = function(err) { 
	if(err.errors) {
		for (var errName in err.errors) {
			if(err.errors[errName].message) return err.errors[errName].message; 
		}
	} else {
		return 'Unknown server error';
	}
};


// create a new Article model instance using HTTP request body
// added authenticated passport user as the article creator
// used the mongoose instance save method to save the article document
exports.create = function(req, res){
	var article = new Article(req.body);
	article.creator = req.user;

	article.save(function(err){
		if(err){
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

// use the find function of mongoose to get the collection of article documents
// sorted by created date, populate user fields to the creator property of the articles objects 
exports.list = function(req, res){
	Article.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, articles){
		if(err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
};

// middleware function contains all express middleware arguments and an id argument
// uses the id to find an article and reference it using the req.article property 
// 
exports.articleById = function(req, res, next, id){
	Article.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, article){
		if(err) return next(err);
		if(!article) return next(new Error('Failed to load article '+id));

		req.article = article;
		next();
	});
};

// outputs the req.article object as a JSON representation 
exports.read = function(req, res){
	res.json(req.article);
};

// obtained the article object via articleById method 
exports.update = function(req, res){
	var article = req.article; 
	article.title = req.body.title;
	article.content = req.body.content;

	article.save(function(err){
		if(err){
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

// obtained the article objext via articleById method 
exports.delete = function(req, res){
	var article = req.article;

	article.remove(function(err){
		if(err){
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

// hasAuthorization middleware is using the req.article and req.user objects to verify that the current user is the creator of the current article
// assumes that it gets executed only for requests containing the articleId route parameter 
exports.hasAuthorization = function(req, res, next){
	if(req.article.creator.id !== req.user.id){
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};