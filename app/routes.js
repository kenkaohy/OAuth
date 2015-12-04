var User = require('./models/user');
module.exports = function(app, passport){
// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res, next) {
        res.render('index', { title: 'OAuth 1st express app' });
    });
    
    //logout
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
	}) 
    
     //assign 'profile.hbs' webpage
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {user:req.user});
    });   
    
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
    //assign 'login.hbs' webpage
    app.get('/login', function(req, res) {
        res.render('login', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        }));
    
    //show sognup form
    app.get('/signup', function(req, res) {
        res.render('signup', {message: req.flash('signupMessage')});
    });
    //process sognup form
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        }));
    
    //facebook route
    // send to facebook to do the authentication
	app.get('/auth/facebook', passport.authenticate('facebook'));
    // handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { successRedirect: '/profile',
	                                      failureRedirect: '/' , scope:['email']}));

    //google route
    // send to google to do the authentication
    app.get('/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']}));
    // send to google to do the authentication    
	app.get('/auth/google/callback', 
	  passport.authenticate('google', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));
     
    //salesforce route
    app.get('/auth/forcedotcom', passport.authenticate('forcedotcom'));
    app.get('/auth/forcedotcom/callback',
        passport.authenticate('forcedotcom',{ successRedirect: '/profile',
	                                           failureRedirect: '/' }));
    //twitter route
    app.get('/auth/twitter',
        passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', 
        passport.authenticate('twitter',{ successRedirect: '/profile',
	                                      failureRedirect: '/' }), function(req,res){
                                              res.redirect('/');
                                          });
                                          
                                          
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================    
    //linking facebook account
	app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));
    //linking google account	
	app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));
    //linking local account, display connect-local.hbs page
	app.get('/connect/local', function(req, res){
		res.render('connect-local.hbs', { message: req.flash('signupMessage')});
	});
    //recive user login info and pass to passport.js
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/connect/local',
		failureFlash: true
	}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future



                                              

       
};

// route middleware to ensure user is logged in
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

