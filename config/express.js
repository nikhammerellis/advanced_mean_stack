var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'), //logger middleware
	compress = require('compression'), //provides response compression
	bodyParser = require('body-parser'), //handles request data
	methodOverride = require('method-override'), //provides DELETE and PUT http verbs
	session = require('express-session'),
	flash = require('connect-flash'),
	passport = require('passport'); //require passport middleware 


module.exports = function() {
	var app = express();

	if(process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));

	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	app.use(flash());
	app.use(passport.initialize()); //middleware responsible for bootstrapping the passport module 
	app.use(passport.session()); //middleware which uses the express session to keep track of your user's session

	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);


	app.use(express.static('./public'));

	return app;
};