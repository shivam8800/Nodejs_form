import Hapi from 'hapi';
import routes from './routes'
import Inert from 'inert';
import Vision from 'vision';
var Path = require('path');
import jwt from 'jsonwebtoken'

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'frontend')
            }
        }
    }
});


const PORT =  process.env.PORT;

server.connection({
	port: PORT || 8080,
	routes: { cors: true }
});

server.route(routes);

server.register([
	Inert,
	Vision,
	{
		register: require('hapi-swagger')
	}],
	function(err) {
		if (err){
			server.log(['error'], 'hapi-swagger load error:' + err )
		} else {
			server.log(['start'], 'hapi-swagger interface loaded')
		}
	});

server.log('info', 'View configuration completed')

server.register( require( 'hapi-auth-jwt' ), ( err ) => {
    server.auth.strategy( 'token', 'jwt', {

        key: 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy',

        verifyOptions: {
            algorithms: [ 'HS256' ],
        }

    } );
} );

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
	    method: 'GET',
	    path: '/{filename}',
	    handler: {
	        file: function (request) {
	        	if (request.params.filename.split('.').pop() == 'html') {
	        	 	return null 
	        	}
	        	else {
	        		 return request.params.filename;	            
	        }
	    }
	}
	});
});

server.start(err=>{
	if (err){
		console.log("Error was handed!");
		console.log(err);
	}

	console.log('Server started at', server.info.uri);
});

