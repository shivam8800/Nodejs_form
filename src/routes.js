const db = require('../database').db;
var FormModel = require('../models/form');
var UserModel = require('../models/user');
var TalentModel = require('../models/talent');
const Joi = require('joi');

import fs from 'fs'
var path = require('path');
var ObjectId = require('mongodb').ObjectID;

const rp = require('request-promise');
const cheerio = require('cheerio');

var request1 = require('request');
// import jwt from 'jsonwebtoken';

const routes =[
	{
	method: 'GET',
	path: '/',
	handler: (request, reply) =>{
			reply.file("index.html");
		}
	},
	{
	method: 'GET',
	path: '/signup',
	handler: (request, reply) =>{
			reply.file("vendor_pages/signup.html");
		}
	},
	{
	method: 'GET',
	path: '/login',
	handler: (request, reply) =>{
			reply.file("vendor_pages/login.html");
		}
	},
	{
	method: 'GET',
	path: '/otp/{objectid}',
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
					reply.file("vendor_pages/otp.html");
				}
			});
		}
	},
	{
	method: 'GET',
	path: '/vendor_pages/{filename}',
	handler: (request, reply) =>{
			if (request.params.filename.split('.').pop() == 'html') {
	        	 	return null 
	        	}
	        	else {
	        		 reply.file('./vendor_pages/' + request.params.filename);	            
	        }
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
			var form = new FormModel(request.payload);
			
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
			const mainData = JSON.parse(request.payload.formModel);

			FormModel.findByIdAndUpdate(
				{"_id":request.params.objectid},
				{ $set: 
					{ total_budget: mainData.total_budget,
					  video_length: mainData.video_length,
					  total_videos: mainData.total_videos,
					  shoot_cities: mainData.shoot_cities,
					  interviewed_people: mainData.interviewed_people}},
				{ new: true },function (err, data) {
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
	},
	{
		method:'POST',
		path: '/create/newuser',
		config:{
			tags: ['api'],
			description: 'create a new user',
			notes: 'create a new user',
		},
		handler: (request, reply) =>{
			var otp = Math.floor(Math.random()*90000) + 10000;
        
        	var api_key = 'key-a790c7dcd4a8d6b103d658321ee4b01e';
			var domain = 'sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org';
			var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
			var data1 = {
			  from: 'From Birch.io <postmaster@sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org>',
			  to: request.payload.email,
			  subject: 'Verify your OTP ',
			  text: "This is your OTP code " + otp  +". \n Enter it In your OTP section input"
			};

			mailgun.messages().send(data1, function (error, body) {
			  if (!error){
				  	var user = new UserModel({
						"username": request.payload.username,
						"email": request.payload.email,
						"phone_number": request.payload.phone_number,
						"otp": otp
					});

					user.save(function(err, data){
						if (err){
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
					});

			  } else {
			  	console.log(error);
			  	throw error
			  }
			});

			
		}
	},
	{
		method: 'PUT',
		path: '/resend/otp/{objectid}',
		config:{
			//Include this api in swagger documentation
			tags: ['api'],
			description: 'resend otp to user',
			notes: 'resend otp to user',
			//we use joi plugin to validate the request
			validate: {
				params: {
					objectid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) =>{
			var otp = Math.floor(Math.random()*90000) + 10000;
        
        	var api_key = 'key-a790c7dcd4a8d6b103d658321ee4b01e';
			var domain = 'sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org';
			var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
			var data1 = {
			  from: 'From Birch.io <postmaster@sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org>',
			  to: request.payload.email,
			  subject: 'Verify your OTP ',
			  text: "This is your resended OTP  code " + otp  +". \n Enter it In your OTP section input"
			};

			mailgun.messages().send(data1, function (error, body) {
			  if (!error){
				  	UserModel.findByIdAndUpdate({"_id":request.params.objectid},{ $set: {otp: otp}},
						{ new: true },function (err, data) {
					  		if (err) {
			    				reply({
			    					statusCode: 503,
			    					message: 'error was handled',
			    					data: err
			    				});
			    			}
			    			else{
			    				reply({
			    					statusCode: 200,
			    					message: "we have resend otp.",
			    					data: data
			    				});
			    			}	
					});

			  } else {
			  	console.log(error);
			  	throw error
			  }
			});
		}
	},
	{
	method:'POST',
	path:'/auth',
	config:{
	    //include this route in swagger documentation
	    tags:['api'],
	    description:"authenticate a user",
	    notes:"authenticate a user",
	    validate:{
	        payload:{
	            email:Joi.string(),
	            otp:Joi.string()
	        }
	    }
	},
	handler: function(request, reply){
			UserModel.find({'email': request.payload.email}, function(err, data){
			    if (err){
			        reply({
			            'error': err
			        });
			    } else if (data.length ==0){
			        reply({
			            'data': "user does not exist!"
			        });
			    } else {
			        if (request.payload.otp == data[0]['otp']){
			            var username =request.payload.username;
			             reply( {
			             	statusCode: 201,
			             	data: data,
			                status: 'success'
			            } );
			        }
			    }
			})
		}
    },
    {
	method: 'GET',
	path: '/loggedin/home/{objectid}',
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
					reply.file("vendor_pages/home.html");
				}
			});
		}	
	},
	{
	method: 'GET',
	path: '/talent/{objectid}',
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
					reply.file("vendor_pages/talent.html");
				}
			});
		}	
	},
	{
	method: 'GET',
	path: '/info/{objectid}',
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
					reply.file("vendor_pages/info.html");
				}
			});
		}	
	},
	{
		path:'/get/userdetail/{email}',
        method:'GET',
        config:{
            //include this route in swagger documentation
            tags:['api'],
            description:"get user detail",
            notes:"get user detail",
            validate:{
                //jobtitile is required field
                params:{
                    email:Joi.string().required()
                }
            }
        },
        handler: (request, reply) =>{
            UserModel.find({"email":request.params.email}, function(err, data){
                if(err){
                    reply({
                        statusCode:503,
                        message:"Failed to get data",
                        data:err
                    });
                }
                else if (data.length === 0 ){
                    reply({
                        statusCode:200,
                        message:"user does not exist",
                        data:data
                    });
                }
                else {
                    reply({
                        statusCode:200,
                        message:"user detail Successfully Fetched",
                        data:data
                    });
                }
            });
        }
	},
	{
		method: 'DELETE',
		path: '/delete/user/{email}',
		config:{
			//include this api in swagger documentation
			tags: ['api'],
			description: 'delete a user',
			notes: 'delete a user',
			validate:{
				params:{
					email: Joi.string()
				}
			}
		},
		handler: function(request, reply){
			UserModel.findOneAndRemove({'email': request.params.email}, function(err, data){
				if (err){
					reply({
						statusCode: 503,
						message: err
					})
				} else if (data === null ){
                    reply({
                        statusCode:200,
                        message:"user does not exist",
                        data:data
                    });
                } 
				else {
					reply({
						statusCode: 201,
						message: 'User deleted successfully'
					})
				}
			});
		}
	},
	{
		method: 'POST',
		path: '/post/talents/ofuser',
		config:{
			//include this api in swagger documentation
			tags: ['api'],
			description: 'delete a user',
			notes: 'delete a user',
		},
		handler: function(request, reply){
			var Talent = new TalentModel({
                  "fiction_writer": request.payload.fiction_writer,
				  "singer": request.payload.singer,
				  "social_media_influencer": request.payload.social_media_influencer,
				  "actor": request.payload.actor,
				  "cinematographer": request.payload.cinematographer,
				  "non_fiction_writer": request.payload.non_fiction_writer,
				  "song_writer": request.payload.song_writer,
				  "voice_actor": request.payload.voice_actor,
				  "user_id": request.payload.user_id
           });
			Talent.save(function(err,data){
               if (err){
                   throw err;
                   console.log(err);
               } else{
                   reply({
                        statusCode: 200,
                        message: 'talent created Successfully',
                        data: data
                    });
               }
           });
		}

	},
	{
		method: 'PUT',
		path: '/updatee/talent_id/usermodle/{objectid}',
		config:{
			//Include this api in swagger documentation
			tags: ['api'],
			description: 'resend otp to user',
			notes: 'resend otp to user',
			//we use joi plugin to validate the request
			validate: {
				params: {
					objectid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) =>{

			UserModel.findByIdAndUpdate({"_id":request.params.objectid},{ $set: {talent_id: request.payload.talent_id}},
						{ new: true },function (err, data) {
					  		if (err) {
			    				reply({
			    					statusCode: 503,
			    					message: 'error was handled',
			    					data: err
			    				});
			    			}
			    			else{
			    				reply({
			    					statusCode: 200,
			    					message: "we have updated the talent_id.",
			    					data: data
			    				});
			    			}	
					});
		}
	},
	{
		method: 'DELETE',
		path: '/delete/talent/{user_id}',
		config:{
			//include this api in swagger documentation
			tags: ['api'],
			description: 'delete a user',
			notes: 'delete a user',
			validate:{
				params:{
					user_id: Joi.string()
				}
			}
		},
		handler: function(request, reply){
			TalentModel.findOneAndRemove({'user_id': request.params.user_id}, function(err, data){
				if (err){
					reply({
						statusCode: 503,
						message: err
					})
				} else if (data === null ){
                    reply({
                        statusCode:200,
                        message:"user does not exist",
                        data:data
                    });
                } 
				else {
					reply({
						statusCode: 201,
						message: 'User deleted successfully'
					})
				}
			});
		}
	},
]

export default routes;