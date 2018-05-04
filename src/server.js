import Hapi from 'hapi';
import routes from './routes'

var Path = require('path');
// var HapiSwagger = require('hapi-swagger')
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT;

global.PRIVATE_KEY = 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy';

const server = Hapi.server({
	host: '0.0.0.0',
	port: 8080 || PORT,
	routes: {
		files: {
			relativeTo: Path.join(__dirname, 'frontend')
		}
	}


});




// server.connection({
// 	port: PORT || 8080,
// 	routes: { cors: true }
// });

const init_server = async () => {



	console.log("Running registeries for plugins");
	await server.register(require('inert'));
	await server.register(require('vision'));
	await server.register(require('hapi-auth-bearer-token'));
	// await server.register({plugin:HapiSwagger});
	console.log("Finished running registeries for plugins");

	server.views({
		engines: {
			html: require('handlebars')
		},
		relativeTo: __dirname,
		path: 'templates',
		partialsPath: "partials",
		layoutPath: 'layouts'
	});

	// Set up a strategy to authenticate requests. We are settings tokens in user's cookie and using that data 
	// to allow access to restricted routes
	server.auth.strategy('accesstoken', 'bearer-access-token', {

		allowCookieToken: true,
		allowQueryToken: true,
		accessTokenName: 'signature',
		validate: async (request, token, h) => {

			let isValid;
			let credentials;


			// here is where you validate your token
			// comparing with token from your database for example

			// verify a token symmetric
			try {
				credentials = jwt.verify(token, global.PRIVATE_KEY);
				// Also check that request is being made from the same ip as earlier
				if (credentials.ip && (credentials.ip == request.info.remoteAddress))
					isValid = true;
				else{
					isValid=false
					credentials={}
				}
					
			} catch (err) {
				isValid = false;
				credentials = {}
			}

			return { isValid, credentials };
		}

	});

	server.state('signature', {
		ttl: 3 * 24 * 60 * 60 * 1000,
		isHttpOnly: true,
		encoding: 'base64',
		isSecure: process.env.NODE_ENV == 'production',
		path: '/',
		strictHeader: true
	});

	server.route(routes);

	server.route({
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: '.',
				index: false
			}
		}
	});









	await server.start();

	console.log('Server started at', server.info.uri);

}

server.log('info', 'View configuration completed')



init_server();

