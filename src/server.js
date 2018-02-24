import Hapi from 'hapi';
import routes from './routes'
import Inert from 'inert';
import Vision from 'vision';

const server = new Hapi.Server();

server.connection({
	port: 8080,
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

server.start(err=>{
	if (err){
		console.log("Error was handed!");
		console.log(err);
	}

	console.log('Server started at', server.info.uri);
})