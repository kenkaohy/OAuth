var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var ForceDotComStrategy = require('passport-forcedotcom').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport){
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session	
	
	// used to serialize the user for the session
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	// used to deserialize the user
	passport.deserializeUser(function(id, done){
		//findById is mongoo function
		User.findById(id, function(err, user){
			done(err, user);
		});
	});
	
	//for local signup strategy
	passport.use('local-signup', new LocalStrategy({
		// will map to html attr 'name'
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	//callback function
	function(req, email, password, done){
		//node async method to database
		//process.nextTick does not excute untill everything else is done
		process.nextTick(function(){
			User.findOne({'local.email': email}, function(err, user){
				if(err)
					return done(err);
				//find email already existing
				if(user){
					return done(null, false, req.flash('signupMessage', 'That email already taken'));
				} else {
					//register new user
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);//hash user password
					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			})
		});
	}));
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
	passport.use('local-login', new LocalStrategy({
		// will map to html attr 'name'
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	//callback function
	function(req, email, password, done){
		//node async method to database
		//process.nextTick does not excute untill everything else is done
		process.nextTick(function(){
			User.findOne({'local.email': email}, function(err, user){
				console.log(user);//"$2a$09$TtbIv0cLT5VRBeLqaKm17euDtC3jZq38.HHllkfr9awXr99dJmtGG"
				if(err)
					return done(err);
				if(!user){
					return done(null, false, req.flash('loginMessage', 'No user found'));
				}
				if(!user.validPassword(password)){
					return done(null, false, req.flash('loginMessage', 'Inavalid password'));					
				}
				return done(null, user);
			})
		});
	}));

	
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
passport.use(new FacebookStrategy({
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
	    callbackURL: configAuth.facebookAuth.callbackURL,
      	profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],		
	    passReqToCallback: true
	  },
	  function(req, accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		//user is not logged in yet
	    		if(!req.user){
					User.findOne({'facebook.id': profile.id}, function(err, user){
		    			if(err)
		    				return done(err);
		    			if(user)
		    				return done(null, user);
		    			else {
		    				var newUser = new User();
		    				newUser.facebook.id = profile.id;
		    				newUser.facebook.token = accessToken;
		    				newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
		    				newUser.facebook.email = profile.emails[0].value;

		    				newUser.save(function(err){
		    					if(err)
		    						throw err;
		    					return done(null, newUser);
		    				})
		    			}
		    		});
	    		}

	    		//user is logged in already, and needs to be merged
	    		else {
	    			var user = req.user;
	    			user.facebook.id = profile.id;
	    			user.facebook.token = accessToken;
	    			user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	    			user.facebook.email = profile.emails[0].value;

	    			user.save(function(err){
	    				if(err)
	    					throw err
	    				return done(null, user);
	    			})
	    		}
	    		
	    	});
	    }

	));//end Facrbook strategy	
	
    // =========================================================================
    // GOOGLE ================================================================
    // =========================================================================	
	passport.use(new GoogleStrategy({
	    clientID: configAuth.googleAuth.clientID,
	    clientSecret: configAuth.googleAuth.clientSecret,
	    callbackURL: configAuth.googleAuth.callbackURL,
		passReqToCallback: true
  	},
	  function(req,accessToken, refreshToken, profile, done) {
		  var pro = profile;
		  	console.log(pro);
	    	process.nextTick(function(){
    		if(!req.user){
	    			User.findOne({'google.id': profile.id}, function(err, user){
		    			if(err)
		    				return done(err);
		    			if(user)
		    				return done(null, user);
		    			else {
		    				var newUser = new User();
		    				newUser.google.id = profile.id;
		    				newUser.google.token = accessToken;
		    				newUser.google.name = profile.displayName;
		    				newUser.google.email = profile.emails[0].value;

		    				newUser.save(function(err){
		    					if(err)
		    						throw err;
		    					return done(null, newUser);
		    				})
		    			}
		    		});
	    		} else {
	    			var user = req.user;
	    			user.google.id = profile.id;
					user.google.token = accessToken;
					user.google.name = profile.displayName;
					user.google.email = profile.emails[0].value;

					user.save(function(err){
						if(err)
							throw err;
						return done(null, user);
					});
	    		}
	    	});
	    }

	));//end google strategy	
	
    // =========================================================================
    // SALESFORCE ==============================================================
    // =========================================================================
	passport.use(new ForceDotComStrategy({
		clientID: configAuth.salesforceAuth.clientID,
		clientSecret: configAuth.salesforceAuth.clientSecret,
		callbackURL: configAuth.salesforceAuth.callbackURL	
		//authorizationURL: configAuth.salesforceAuth.SF_AUTHORIZE_URL,
		//tokenURL: configAuth.salesforceAuth.SF_TOKEN_URL
		//scope: ['id','api']
	}, function verify(token, refreshToken, profile, done) {
		console.log(profile);
		 // asynchronous verification, for effect...
		 process.nextTick(function(){		 
				//search lcoal mongooDB
	    		User.findOne({'salesforce.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
					//found user
	    			if(user)
	    				return done(null, user);
					//no found & registor for new FB user	
	    			else {
	    				var newUser = new User();
	    				newUser.salesforce.id = profile.id;
	    				newUser.salesforce.token = token;
	    				newUser.salesforce.name = profile.displayName;
	    				newUser.salesforce.email = profile.emails;
	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				console.log(profile);
	    			}
	    		});
		 });
		
	}));	
    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================	
	passport.use(new TwitterStrategy({
	    consumerKey: configAuth.twitterAuth.consumerKey,
	    consumerSecret: configAuth.twitterAuth.consumerSecret,
	    callbackURL: configAuth.twitterAuth.callbackURL,
		include_email: true,
		passReqToCallback: true
  		},
	  function(accessToken, refreshToken, profile, done) {
		  	console.log(profile);
	    	process.nextTick(function(){
				//search lcoal mongooDB
	    		User.findOne({'twitter.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
					//found user
	    			if(user)
	    				return done(null, user);
					//no found & registor for new FB user	
	    			else {
	    				var newUser = new User();
	    				newUser.twitter.id = profile.id;
	    				newUser.twitter.token = accessToken;
	    				newUser.twitter.name = profile.displayName;
	    				newUser.twitter.email = profile.emails;
	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				console.log(profile);
	    			}
	    		});
	    	});
	    }

	));//end google strategy		
		
};