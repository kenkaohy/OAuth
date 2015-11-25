var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport){
	//save the user data in the session
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	//looking at whole user info. (e.g. username, password, birthday etc.)
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
	
	//for local login strategy
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

	
	//Facrbook strategy	
	passport.use(new FacebookStrategy({
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
	    callbackURL: configAuth.facebookAuth.callbackURL,
  		profileFields: ["id", "birthday", "emails","first_name", "last_name", "gender", "picture.width(200).height(200)"],
  		//profileFields: ["id", "birthday", "emails", "first_name", "last_name", "gender", "picture.width(200).height(200)"],
	  },
	  function(accessToken, refreshToken, profile, done) {
		  console.log(profile);
	    	process.nextTick(function(){
				//search lcoal mongooDB
	    		User.findOne({'facebook.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
					//found user
	    			if(user)
	    				return done(null, user);
					//no found & registor for new FB user	
	    			else {
	    				var newUser = new User();
	    				newUser.facebook.id = profile.id;
	    				newUser.facebook.token = accessToken;
						newUser.facebook.firstName = profile.name.givenName;
						newUser.facebook.lastName = profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;
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

	));//end Facrbook strategy	
	
	//google strategy	
	passport.use(new GoogleStrategy({
	    clientID: configAuth.googleAuth.clientID,
	    clientSecret: configAuth.googleAuth.clientSecret,
	    callbackURL: configAuth.googleAuth.callbackURL
  		},
	  function(accessToken, refreshToken, profile, done) {
		  var pro = profile;
		  	console.log(pro);
	    	process.nextTick(function(){
				//search lcoal mongooDB
	    		User.findOne({'google.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
					//found user
	    			if(user)
	    				return done(null, user);
					//no found & registor for new FB user	
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
	    				console.log(profile);
	    			}
	    		});
	    	});
	    }

	));//end google strategy	
};