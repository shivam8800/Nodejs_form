const db = require('../database').db;
var FormModel = require('../models/form');
const Joi = require('joi');

import fs from 'fs'
var path = require('path');


const routes =[
	{
	method: 'GET',
	path: '/',
	handler: (request, reply) =>{
			reply("Hello world");
		}
	},
	{
		method: 'GET',
		path: '/get/alluser',
		config: {
			//Include this api in swagger documentation
			tags: ['api'],
			description: 'Get all forms',
			notes: 'Get all forms'
		},
		handler: (request, reply) =>{
			
			FormModel.find({}, function(error, data){
				if (error){
					reply({
						statusCode: 503,
						message: 'Failed to get data',
						data: error
					});
				} else {
					reply({
						statusCode: 200,
						message: 'Form data successfully fetched',
						data: data
					});
				}
			});
		}
	},
	{
		method: 'POST',
		path: '/post/userdetails',
		config: {
			//Include this api in swagger documentation
			tags: ['api'],
			description: 'submit a new form',
			notes: 'submit a new form',
			//we use joi plugin to validate the request
			validate: {
				payload: {
					name: Joi.string().required(),
					email: Joi.string().required(),
				}
			}
		},
		handler: (request, reply) =>{
			//create a mongodb form object	to save it into database
			var form = new FormModel(request.payload);

			console.log(request.payload);

			//call save method to save it and pass call back method to handel a error
			form.save(function(err){
				if (err){
					// console.log(err)
					reply({
						statusCode: 503,
						message: err
					});
				} else {
					reply({
						statusCode: 201,
						message: 'User created successfully!'
					});
				}
			})
		}
	},
	{

	    method: 'POST',
	    path: '/audio',
	    config: {
	    	//Include this api in swagger documentation
			tags: ['api'],
			description: 'upload audio file',
			notes: 'upload audio file',

	        payload: {
	            output: 'stream',
	            parse: true,
	            allow: 'multipart/form-data'
	        },

	        handler: function (request, reply) {
	            var data = request.payload;
	            if (data.file) {
	                var name = data.file.hapi.filename;
	                var path = __dirname + "/uploads/" + name;
	                var file = fs.createWriteStream(path);

	                file.on('error', function (err) { 
	                    console.error(err)
	                });

	                data.file.pipe(file);

	                data.file.on('end', function (err) { 
	                    var ret = {
	                        filename: data.file.hapi.filename,
	                        headers: data.file.hapi.headers
	                    }
	                    reply(JSON.stringify(ret));
	                })
	            }

	        }
	    }
	},
	{
		method: 'GET',
		path: '/get/user/{emailid}',
		config: {
			//include this api in swagger documentation
			tags: ['api'],
			description: 'get a particular user details',
			notes: 'get a particular user details',
			//we use joi plugin to validate the request
			validate: {
				params: {
					emailid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) =>{
			FormModel.find({"email":request.params.emailid}, function(err, data){
    			// console.log('dslfkjlkds');
    			if (err) {
    				reply({
    					statusCode: 503,
    					message: 'no metch found',
    					data: err
    				});
    			}
    			else{
    				reply({
    					statusCode: 200,
    					message: "your complaint has been found results are here.",
    					data: data
    				});
    			}
    		});
		}
	},
	{
		method: 'GET',
		path: '/get/userfile/{emailid}',
		config: {
			//include this api in swagger documentation
			tags: ['api'],
			description: 'get file of particular user',
			notes: 'get file of particular user',
			//we use joi plugin to validate the request
			validate: {
				params: {
					emailid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) =>{
			var file = path.join(__dirname + "/uploads/", request.params.emailid + ".mp3");

			fs.readFile(file , function (err,data){
                return reply(data)
                .header('Content-disposition', 'attachment; filename=' + request.params.emailid + ".mp3")
            });
		}
	}
]

export default routes;