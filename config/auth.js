//webapi config info.

module.exports ={
	'facebookAuth':{
		'clientID': '1621033081494642',
		'clientSecret': '9812674b7750611e35effcb375b7e0a2',
		'callbackURL': 'http://localhost:3000/auth/facebook/callback'		
	},	
	'googleAuth':{
		'clientID': '183320168161-lnaoi70nrtn09j0h5s98mnaaa0eik30v.apps.googleusercontent.com',
		'clientSecret': 'VO_2YULch1iRHK3Ict3zFH8Y',
		'callbackURL': 'http://localhost:3000/auth/google/callback'		
	},
	'salesforceAuth':{
		'clientID': '3MVG9Y6d_Btp4xp50waPOyk8QyonMQevRPETDFrOJCq_T5.SA0W3efJzEomB6h2gFAP5dAbYX6wR_5uqOOqxe',
		'clientSecret': '1201159985336647286',
		'callbackURL': 'http://localhost:3000/auth/forcedotcom/callback',
		'scope': 'sfdc_oppty_api',
		'SF_AUTHORIZE_URL':'https://login.salesforce.com/services/oauth2/authorize',
		'SF_TOKEN_URL':'https://login.salesforce.com/services/oauth2/token'		
	},
	'twitterAuth':{
		'consumerKey': 'drpOeOSmGhHQYeAm2YjykY0lc',
		'consumerSecret': 'kYlVrBTWmz5EvuUDpmNPsFa7zi9IlOeYEg5du5dPdWGsMjvVBY',
		'callbackURL': 'http://127.0.0.1:3000/auth/twitter/callback'		
	},
	'githubAuth':{
		'clientID': 'enter client id here',
		'clientSecret': 'enter client secret here',
		'callbackURL': 'http://localhost:3000/auth/twitter/callback'		
	}
	
}