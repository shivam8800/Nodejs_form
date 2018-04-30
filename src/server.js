import Hapi from 'hapi';
import routes from './routes'

var Path = require('path');
// var HapiSwagger = require('hapi-swagger')
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT;

global.PRIVATE_KEY = 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy';

const server = Hapi.server({
	host: 'localhost',
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
		partialsPath: "partials"
	});

	server.state('signature', {
		ttl: null,
		isSecure: true,
		isHttpOnly: true,
		encoding: 'base64json',
		clearInvalid: false, // remove invalid cookies
		strictHeader: true // don't allow violations of RFC 6265
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




	server.auth.strategy('simple', 'bearer-access-token', {

		allowCookieToken: true,
		validate: async (request, token, h) => {

			// here is where you validate your token
			// comparing with token from your database for example

			// verify a token symmetric
			jwt.verify(token, global.PRIVATE_KEY, function (err, decoded) {
				if(err){
					const isValid=false
					const credentials = null;
				}
					
				else{
					const isValid=true
					const credentials = decoded;
				}
					
			});
	
			// const artifacts = { test: 'info' };

			return { isValid, credentials };
		}

	});




	await server.start();

	console.log('Server started at', server.info.uri);

}

server.log('info', 'View configuration completed')



init_server();

