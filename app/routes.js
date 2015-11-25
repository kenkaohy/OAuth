var User = require('./models/user');
module.exports = function(app, passport){
    //index
    app.get('/', function(req, res, next) {
        res.render('index', { title: 'OAuth 1st express app' });
    });

    //assign 'login.hbs' webpage
    app.get('/login', function(req, res) {
        res.render('login', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        }));
    
    //assign 'signup.hbs' webpage
    app.get('/signup', function(req, res) {
        res.render('signup', {message: req.flash('signupMessage')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        }));

    //assign 'profile.hbs' webpage
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {user:req.user});
    });
    
    //facebook route
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { successRedirect: '/profile',
	                                      failureRedirect: '/' , scope:['email']}));

    //google route
    app.get('/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']}));
	app.get('/auth/google/callback', 
	  passport.authenticate('google', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));
                                          
    //logout
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
	})
       
};

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}



	// app.get('/:username/:password', function(req, res){
	// 	var newUser = new User();
	// 	newUser.local.username = req.params.username;
	// 	newUser.local.password = req.params.password;
	// 	console.log(newUser.local.username + " " + newUser.local.password);
	// 	newUser.save(function(err){
	// 		if(err)
	// 			throw err;
	// 	});
	// 	res.send("Success!");
	// })

