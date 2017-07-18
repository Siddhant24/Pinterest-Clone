'use strict';

var path = process.cwd();
var imageHandler = require('../controllers/imageHandler.js');

module.exports = function(app, passport) {

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/my')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/myPics.html');
		})
		.post(isLoggedIn, function(req, res) {
			console.log(req.body);
			imageHandler.newImage(req.body, req.user._id);
			res.redirect('/my');
		});

	app.route('/myPics')
		.get(isLoggedIn, async function(req, res) {
			var data = await imageHandler.findMyImages(req.user._id);
			res.send(data);
		})
		.post(isLoggedIn, async function(req, res){
			res.send(await imageHandler.addLike(req.user._id, req.body.image_id));	
		});

	app.route('/allPics')
		.get(isLoggedIn, async function(req, res) {
			var data = await imageHandler.findAllImages();
			res.send(data);
		})
		.post(isLoggedIn, function(req, res) {
			console.log(req.body);
			imageHandler.deleteMyImage(req.body.image_id);
			res.send("deleted");
		});

	app.route('/login')
		.get(function(req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function(req, res) {
			res.json(req.user.twitter);
		});

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

};
