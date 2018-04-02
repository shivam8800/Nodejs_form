const db = require('../database').db;
var FormModel = require('../models/form');
const Joi = require('joi');

import fs from 'fs'
var path = require('path');
var ObjectId = require('mongodb').ObjectID;

const rp = require('request-promise');
const cheerio = require('cheerio');

var request1 = require('request');


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
		path: '/additionalDetail/{objectid}',
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
    				reply.file("./index1.html");
    			}
    		});
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
    				reply.file("./show.html");
					// var api_key = 'key-a790c7dcd4a8d6b103d658321ee4b01e';
					// var domain = 'sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org';
					// var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
					// var filepath = path.join(__dirname + "/uploads/" , request.params.objectid + '.mp3');
					// var data1 = {
					//   from: 'From Birch.io <postmaster@sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org>',
					//   to: data['email'],
					//   subject: 'Submited details',
					//   text: "your name is " + data['name'] + ".Your email id is " + data['email'] + " and phone number is " + data['countryCode'] +"-"+ data['phone_number'] + ".",
					//     attachment: filepath
					// };
					// mailgun.messages().send(data1, function (error, body) {
					//   console.log("this is body",body);
					//   if (!error){
					// 	reply.file("./show.html");
					//   } else {
					//   	console.log(error);
					//   }
					// });
    			}
    		});
		}
	},
	{
		method: 'GET',
		path: '/show/orders/{emailid}',
		config:{
			//we use joi plugin to validate the request
			validate:{
				params:{
					emailid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) =>{
			var order = {
				"email": request.params.emailid
			}

			FormModel.find(order, function(err, orders){
				if (err) {
    				reply({
    					statusCode: 503,
    					message: 'no metch found',
    					data: err
    				});
    			}
    			else{
    				reply.file('./allorders.html')
    			}
			});
		}
	},
	{
		method: 'GET',
		path: '/get/allorders',
		config: {
			//Include this api in swagger documentation
			tags: ['api'],
			description: 'Get all orders',
			notes: 'Get all orders'
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
		path: '/post/new/order',
		config: {
			//Include this api in swagger documentation
			tags: ['api'],
			description: 'submit a new form',
			notes: 'submit a new form'
		},
		handler: (request, reply) =>{
			//create a mongodb form object	to save it into database
			var form = new FormModel(request.payload);
			//call save method to save it and pass call back method to handel a error
			form.save(function(err, data){
				if (err){
					// console.log(err)
					reply({
						statusCode: 503,
						message: err
					});
				} else {
					reply({
						statusCode: 201,
						message: 'User created successfully!',
						data: data
					});
				}
			})
		}
	},
	{
		method: 'PUT',
		path: '/update/order/{objectid}',
		config:{
			//Include this api in swagger documentation
			tags: ['api'],
			description: 'update existing order',
			notes: 'update existing order',
			//we use joi plugin to validate the request
			validate: {
				params: {
					objectid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) =>{
			console.log(request.payload);
			FormModel.findByIdAndUpdate({"_id":request.params.objectid}, { $set: { total_budget: request.payload.total_budget,video_length: request.payload.video_length,total_videos: request.payload.total_videos,shoot_cities: request.payload.shoot_cities,interviewed_people: request.payload.interviewed_people}},{ new: true },function (err, data) {
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
	    					message: "you have successfully updated your details.",
	    					data: data
	    				});
	    			}	
			});
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
		path: '/get/order/{objectid}',
		config: {
			//include this api in swagger documentation
			tags: ['api'],
			description: 'get a particular user details',
			notes: 'get a particular user details',
			//we use joi plugin to validate the request
			validate: {
				params: {
					objectid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) =>{
			FormModel.find({"_id":request.params.objectid}, function(err, data){
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
		path: '/get/userfile/{objectid}',
		config: {
			//we use joi plugin to validate the request
			validate: {
				params: {
					objectid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) =>{
			var file = path.join(__dirname + "/uploads/", request.params.objectid + ".mp3");

			fs.readFile(file , function (err,data){
                return reply(data)
                .header('Content-disposition', 'attachment; filename=' + request.params.objectid + ".mp3")
            });
		}
	},
	{
		method: 'GET',
		path: '/get/orders/{emailid}',
		config:{
			//include this api in swagger documetion
			tags: ['api'],
			description: 'get all orders of a user',
			notes: 'get all orders of a user',
			//we use joi plugin to validate the request
			validate:{
				params:{
					emailid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) =>{
			var order = {
				"email": request.params.emailid
			}

			FormModel.find(order, function(err, orders){
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
    					data: orders
    				});
    			}
			});
				
		}
	},
	{
		method: 'GET',
		path: '/get/allcities',
		config:{
			tags: ['api'],
			description: 'get list of all cities of whole world',
			notes: 'get list of all cities of whole world'
		},
		handler: (request, reply) =>{
			var file = path.join(__dirname + '/cities.txt' );
			var array = fs.readFileSync(file).toString().split("\n");
			reply(array);
		}
	}
]

export default routes;