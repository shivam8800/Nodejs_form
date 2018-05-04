const db = require('../database').db;
var FormModel = require('../models/form');
var UserModel = require('../models/user');
var TalentModel = require('../models/talent');
var VendorTask = require('../models/vendor_tasks');
var Mailer = require('./mailer');
const Joi = require('joi');
var async = require("async");
import jwt from 'jsonwebtoken';
require('./handlebar-helpers')

import fs from 'fs'
var path = require('path');
var ObjectId = require('mongoose').ObjectID;

const rp = require('request-promise');
const cheerio = require('cheerio');

const ADMIN_EMAILS = ["vineet@birchapp.io"]

var request1 = require('request');
// import jwt from 'jsonwebtoken';

const routes = [
	{
		method: 'GET',
		path: '/',
		handler: (request, h) => {
			return h.view("index", { title: 'Get an invite' });
		}
	},
	{
		method: 'GET',
		path: '/signup',
		handler: (request, h) => {
			// h.state('signature','test')
			return h.view("vendor-signup", { title: "Sign up as a creator | Birch" }, { layout: 'vendor_layout' });
		}
	},

	{
		method: 'GET',
		path: '/otp/{objectid}',
		handler: (request, reply) => {
			FormModel.findOne({ '_id': ObjectId(request.params.objectid) }, function (err, data) {
				if (err) {
					reply({
						statusCode: 503,
						message: 'no match found',
						data: err
					});
				}
				else {
					reply.file("vendor_pages/otp.html");
				}
			});
		}
	},

	{
		method: 'GET',
		path: '/additionalDetail/{objectid}',
		handler: (request, reply) => {
			FormModel.findOne({ '_id': ObjectId(request.params.objectid) }, function (err, data) {
				if (err) {
					reply({
						statusCode: 503,
						message: 'no metch found',
						data: err
					});
				}
				else {
					reply.view("index1");
				}
			});
		}
	},
	{
		method: 'GET',
		path: '/record/{objectid}',
		handler: (request, reply) => {
			FormModel.findOne({ '_id': ObjectId(request.params.objectid) }, function (err, data) {
				if (err) {
					reply({
						statusCode: 503,
						message: 'no metch found',
						data: err
					});
				}
				else {
					reply.view("record");
				}
			});
		}
	},
	{
		method: 'GET',
		path: '/show/{objectid}',
		handler: (request, reply) => {
			FormModel.findOne({ '_id': ObjectId(request.params.objectid) }, function (err, data) {
				if (err) {
					reply({
						statusCode: 503,
						message: 'no metch found',
						data: err
					});
				}
				else {
					reply.view("show");
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
		config: {
			//we use joi plugin to validate the request
			validate: {
				params: {
					emailid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) => {
			var order = {
				"email": request.params.emailid
			}

			FormModel.find(order, function (err, orders) {
				if (err) {
					reply({
						statusCode: 503,
						message: 'no metch found',
						data: err
					});
				}
				else {
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
		handler: (request, reply) => {

			FormModel.find({}, function (error, data) {
				if (error) {
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
		handler: (request, reply) => {
			var form = new FormModel(request.payload);

			form.save(function (err, data) {
				if (err) {
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
		config: {
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
		handler: (request, reply) => {
			const mainData = JSON.parse(request.payload.formModel);

			FormModel.findByIdAndUpdate(
				{ "_id": request.params.objectid },
				{
					$set:
						{
							total_budget: mainData.total_budget,
							video_length: mainData.video_length,
							total_videos: mainData.total_videos,
							shoot_cities: mainData.shoot_cities,
							interviewed_people: mainData.interviewed_people
						}
				},
				{ new: true }, function (err, data) {
					if (err) {
						reply({
							statusCode: 503,
							message: 'no metch found',
							data: err
						});
					}
					else {
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
		handler: (request, reply) => {
			FormModel.find({ "_id": request.params.objectid }, function (err, data) {
				if (err) {
					reply({
						statusCode: 503,
						message: 'no metch found',
						data: err
					});
				}
				else {
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
		handler: (request, reply) => {
			var file = path.join(__dirname + "/uploads/", request.params.objectid + ".mp3");

			fs.readFile(file, function (err, data) {
				return reply(data)
					.header('Content-disposition', 'attachment; filename=' + request.params.objectid + ".mp3")
			});
		}
	},
	{
		method: 'GET',
		path: '/get/orders/{emailid}',
		config: {
			//include this api in swagger documetion
			tags: ['api'],
			description: 'get all orders of a user',
			notes: 'get all orders of a user',
			//we use joi plugin to validate the request
			validate: {
				params: {
					emailid: Joi.string().required()
				}
			}
		},
		handler: (request, reply) => {
			var order = {
				"email": request.params.emailid
			}

			FormModel.find(order, function (err, orders) {
				if (err) {
					reply({
						statusCode: 503,
						message: 'no metch found',
						data: err
					});
				}
				else {
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
		path: '/api/allcities',
		handler: (request, h) => {
			var file = path.join(__dirname + '/cities.txt');
			var array = fs.readFileSync(file).toString().split("\n");
			return h.response({
				statusCode:201,
				message:array
			});
		}
	},
	{
		method: 'POST',
		path: '/api/vendor/signup',
		handler: (request, reply) => {
			var otp = Math.floor(Math.random() * 90000) + 10000;

			var user = new UserModel({
				"name": request.payload.name,
				"email": request.payload.email,
				"phone_number": request.payload.phone_number,
				"country_code": request.payload.country_code,
				"otp": otp
			});

			user.save(function (err, data) {
				if (err) {
					reply({
						statusCode: 503,
						message: err
					});
				} else {

					Mailer.send_vendor_signup_email(request.payload.email, { otp: otp });

					reply({
						statusCode: 201,
						message: data
					});
				}
			});


		}
	},
	{
		method: 'GET',
		path: "/api/vendor/generateotp/{email}",
		config: {
			validate: {
				params: {
					email: Joi.string().email().required()
				}
			}
		},
		handler: async (request, h) => {

			let otp = Math.floor(Math.random() * 90000) + 10000;

			let user = await UserModel.findOneAndUpdate({ email: request.params.email }, { $set: { otp: otp,otp_issued_for:request.info.remoteAddress}})
			let mail_status;

			console.log(user)

			if (user) {
				mail_status = await Mailer.send_vendor_otp(request.params.email, { otp: otp })
			}
			else {
				return h.response({
					statusCode: 503,
					message: "No such user found"
				});
			}

			return h.response({
				statusCode: 201,
				message: mail_status
			});


		}

	},
	{
		method: "POST",
		path: "/api/vendor/update",
		config: {
			auth: "accesstoken"
		},
		handler: async (request, h) => {

			// Find the user based on cookie update specific fields provided in payload field
			let error
			let updated_vendor = await UserModel.findByIdAndUpdate(request.auth.credentials._id, { $set: request.payload }, { new: true }).catch(err => { error = err })

			// Send back response
			if (error) {
				return h.response({
					statusCode: 503,
					message: error
				})
			} else {
				// Remember to delete otp from vendor obejct
				delete updated_vendor.otp
				return h.response({
					statusCode: 201,
					message: updated_vendor
				})
			}


		}
	},
	{
		method: 'PUT',
		path: '/resend/otp/{objectid}',
		config: {
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
		handler: (request, reply) => {
			var otp = Math.floor(Math.random() * 90000) + 10000;

			var api_key = 'key-a790c7dcd4a8d6b103d658321ee4b01e';
			var domain = 'sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org';
			var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
			var data1 = {
				from: 'From Birch.io <postmaster@sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org>',
				to: request.payload.email,
				subject: 'Verify your OTP ',
				text: "This is your resended OTP  code " + otp + ". \n Enter it In your OTP section input"
			};

			mailgun.messages().send(data1, function (error, body) {
				if (!error) {
					UserModel.findByIdAndUpdate({ "_id": request.params.objectid }, { $set: { otp: otp } },
						{ new: true }, function (err, data) {
							if (err) {
								reply({
									statusCode: 503,
									message: 'error was handled',
									data: err
								});
							}
							else {
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
		method: 'POST',
		path: '/api/vendor/auth',
		config: {
			//include this route in swagger documentation
			tags: ['api'],
			description: "authenticate a vendor",
			notes: "authenticate a vendor",
			validate: {
				payload: {
					email: Joi.string().email(),
					otp: Joi.number()
				}
			}
		},
		handler: async (request, h) => {


			// The OTP can only be issued on the IP address it was issued for
			let user = await UserModel.findOne({ email: request.payload.email, otp: request.payload.otp, otp_issued_for:request.info.remoteAddress })

			if (!user) {
				return h.response({
					statusCode: 503,
					message: user
				});
			} else {

				let response_payload = user.toJSON()
				delete response_payload.otp

				// Add the requesting IP to signature
				response_payload.ip = request.info.remoteAddress

				let token = jwt.sign(response_payload, global.PRIVATE_KEY);

				// We cant set cookie here since the client might make XHR request
				// So we redicrect to another route where cookie is set and user is further sent to the right destination
				h.state('signature', token)
				return h.redirect(`/onbaording/talents/${response_payload._id}`)

			}


		}
	},
	{
		method: 'GET',
		path: '/loggedin/home/{objectid}',
		handler: (request, reply) => {
			FormModel.findOne({ '_id': ObjectId(request.params.objectid) }, function (err, data) {
				if (err) {
					reply({
						statusCode: 503,
						message: 'no metch found',
						data: err
					});
				}
				else {
					reply.file("vendor_pages/home.html");
				}
			});
		}
	},
	{
		method: 'GET',
		path: '/admin/talents',
		options: {
			auth: 'accesstoken'
		},
		handler: async (request, h) => {

			

			if(! ADMIN_EMAILS.includes(request.auth.credentials.email)){
				return h.response({
					statusCode: 403,
					message: "Hold it! You are not allowed here."
				})
			}

			let error

			let talents = await TalentModel.find({}).catch(err => { error = err })

			if (error) {
				return h.response({
					statusCode: 503,
					message: error
				})
			} else
				return h.view('admin_talents', { talents: talents.map(t => t.toJSON()) }, { layout: 'vendor_layout' })

		}
	},
	{
		method: 'POST',
		path: '/admin/talents',
		options: {
			auth: 'accesstoken'
		},
		handler: async (request, h) => {

			if(! ADMIN_EMAILS.includes(request.auth.credentials.email)){
				return h.response({
					statusCode: 403,
					message: "Hold it! You are not allowed here."
				})
			}

			let error

			await TalentModel.create({ talent_name: request.payload.talent_name }).catch(err => { error = err })
			let talents = await TalentModel.find({}).catch(err => { error = err })

			if (error) {
				return h.response({
					statusCode: 503,
					message: error
				})
			} else
				return h.view('admin_talents', { talents: talents.map(t => t.toJSON()) }, { layout: 'vendor_layout' })

		}
	},
	{
		method: 'GET',
		path: '/admin/tasks',
		options: {
			auth: 'accesstoken'
		},
		handler: async (request, h) => {

		
			if(! ADMIN_EMAILS.includes(request.auth.credentials.email)){
				return h.response({
					statusCode: 403,
					message: "Hold it! You are not allowed here."
				})
			}

			let error

			let tasks = await VendorTask.find({}).populate('talent').catch(err => { error = err })

			if (error) {
				return h.response({
					statusCode: 503,
					message: error
				})
			} 

			let talents = await TalentModel.find({}).catch(err => { error = err })

			if (error) {
				return h.response({
					statusCode: 503,
					message: error
				})
			} 

			return h.view('admin_tasks', { tasks: tasks.map(t => t.toJSON()),talents: talents.map(t => t.toJSON()) }, { layout: 'vendor_layout' })
			
				

		}
	},
	{
		method: 'POST',
		path: '/admin/tasks',
		options: {
			auth: 'accesstoken'
		},
		handler: async (request, h) => {

			if(! ADMIN_EMAILS.includes(request.auth.credentials.email)){
				return h.response({
					statusCode: 403,
					message: "Hold it! You are not allowed here."
				})
			}

			let error

			await VendorTask.create(request.payload).catch(err => { error = err })
			let tasks = await VendorTask.find({}).catch(err => { error = err })

			if (error) {
				return h.response({
					statusCode: 503,
					message: error
				})
			} else
				 return h.response({
					statusCode: 201,
					message: tasks
				})

		}
	},
	{
		method: 'GET',
		path: '/talent/{objectid}',
		handler: (request, reply) => {
			FormModel.findOne({ '_id': ObjectId(request.params.objectid) }, function (err, data) {
				if (err) {
					reply({
						statusCode: 503,
						message: 'no metch found',
						data: err
					});
				}
				else {
					reply.file("vendor_pages/talent.html");
				}
			});
		}
	},
	{
		method: 'GET',
		path: '/onbaording/talents',
		options: {
			auth: 'accesstoken'
		},
		handler: async (request, h) => {

			let error

			// Fetch the master talent set 
			let talents = await TalentModel.find({}).catch(err => { error = err })

			if (error) {
				h.response({
					statusCode: 503,
					message: error
				});
			} else
				return h.view('vendor_onboarding_1', { title: 'Complete your profile on Birch', talents: talents.map(t => t.toJSON()) }, { layout: 'vendor_layout' })
		}
	},
	{
		path: '/onboarding/vitalinfo',
		method: 'GET',
		config: {
			auth:"accesstoken"
		},
		handler: (request, h) => {
			return h.view('vendor_onboarding_2', { title: 'Complete your profile on Birch'}, { layout: 'vendor_layout' })
		}
	},
	{
		method: 'DELETE',
		path: '/delete/user/{email}',
		config: {
			//include this api in swagger documentation
			tags: ['api'],
			description: 'delete a user',
			notes: 'delete a user',
			validate: {
				params: {
					email: Joi.string()
				}
			}
		},
		handler: function (request, reply) {
			UserModel.findOneAndRemove({ 'email': request.params.email }, function (err, data) {
				if (err) {
					reply({
						statusCode: 503,
						message: err
					})
				} else if (data === null) {
					reply({
						statusCode: 200,
						message: "user does not exist",
						data: data
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
		config: {
			//include this api in swagger documentation
			tags: ['api'],
			description: 'delete a user',
			notes: 'delete a user',
		},
		handler: function (request, reply) {
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
			Talent.save(function (err, data) {
				if (err) {
					throw err;
					console.log(err);
				} else {
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
		config: {
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
		handler: (request, reply) => {

			UserModel.findByIdAndUpdate({ "_id": request.params.objectid }, { $set: { talent_id: request.payload.talent_id } },
				{ new: true }, function (err, data) {
					if (err) {
						reply({
							statusCode: 503,
							message: 'error was handled',
							data: err
						});
					}
					else {
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
		config: {
			//include this api in swagger documentation
			tags: ['api'],
			description: 'delete a user',
			notes: 'delete a user',
			validate: {
				params: {
					user_id: Joi.string()
				}
			}
		},
		handler: function (request, reply) {
			TalentModel.findOneAndRemove({ 'user_id': request.params.user_id }, function (err, data) {
				if (err) {
					reply({
						statusCode: 503,
						message: err
					})
				} else if (data === null) {
					reply({
						statusCode: 200,
						message: "user does not exist",
						data: data
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
		path: '/user/video/{objectid}',
		config: {
			//Include this api in swagger documentation
			tags: ['api'],
			description: 'uploads video file by user',
			notes: 'uploads video file by user',

			payload: {
				output: 'stream',
				parse: true,
				allow: 'multipart/form-data'
			},

			handler: function (request, reply) {
				var data = request.payload;
				if (data.file) {
					data.file.hapi.filename = request.params.objectid;
					console.log(data.file.hapi.filename);
					var name = data.file.hapi.filename;
					var path = __dirname + "/video_files/" + name + '.mp4';
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
	}
]

export default routes;