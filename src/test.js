'use strict';

const Bcrypt = require('bcrypt');
const Hapi = require('hapi');


const start = async () => {

    const server = Hapi.server({ host:"127.0.0.1",port: 4000 });

    

    server.state('signature', {
        ttl: null,
        isSecure: false,
        isHttpOnly: false,
        encoding: 'base64',
        clearInvalid: false, // remove invalid cookies
        strictHeader: true // don't allow violations of RFC 6265
    });
    

    server.route({
        method: 'GET',
        path: '/',
       
        handler: function (request, h) {
            h.state('signature', 'Another Test');

            return h.response({statusCode:200,message:'welcome'});
        }
    });

    await server.start();

    console.log('server running at: ' + server.info.uri);
};

start();
