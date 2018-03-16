const db = require('../database').db;
var FormModel = require('../models/form');
const Joi = require('joi');

import fs from 'fs'
var path = require('path');
var cool = require('cool-ascii-faces');
var ObjectId = require('mongodb').ObjectID;


const routes =[
	{
	method: 'GET',
	path: '/',
	handler: (request, reply) =>{
			reply.file("./index.html");
		}
	},
	{
		method: 'GET',
		path: '/record/{objectid}',
		handler: (request, reply) =>{
			FormModel.findOne({'_id': ObjectId(request.params.objectid) }, function(err, data){
    			if (err) {
    				reply({
    					statusCode: 503,
    					message: 'no metch found',
    					data: err
    				});
    			}
    			else{
    				reply.file("./record.html");
    			}
    		});
		}
	},
	{
		method: 'GET',
		path: '/show/{objectid}',
		handler: (request, reply) =>{
			FormModel.findOne({'_id': ObjectId(request.params.objectid) }, function(err, data){
    			if (err) {
    				reply({
    					statusCode: 503,
    					message: 'no metch found',
    					data: err
    				});
    			}
    			else{
					var api_key = 'key-a790c7dcd4a8d6b103d658321ee4b01e';
					var domain = 'sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org';
					var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
					var filepath = path.join(__dirname + "/uploads/" , data['email'] + '.mp3');


					var data1 = {
					  from: 'From Birch.io <postmaster@sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org>',
					  to: data['email'],
					  subject: 'Submited details',
					  text: "your name is " + data['name'] + ".Your email id is " + data['email'] + " and phone number is " + data['country_code'] +"-"+ data['phone_number'] + ".",
					    attachment: filepath
					};
					mailgun.messages().send(data1, function (error, body) {
					  if (!error){
						reply.file("./show.html");
					  } else {
					  	console.log(error);
					  }
					});
    			}
    		});
		}
	},
	{
		method: 'GET',
		path: '/cool',
		handler: (request, reply) =>{
			reply(cool());
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
		},
		handler: (request, reply) =>{
			//create a mongodb form object	to save it into database
			var form = new FormModel(request.payload);

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