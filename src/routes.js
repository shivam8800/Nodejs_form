const db = require('../database').db;
var FormModel = require('../models/form');
const Joi = require('joi');



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
		path: '/api/forms',
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
		path: '/api/form',
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
					audiosrc: Joi.string().required()
				}
			}
		},
		handler: (request, reply) =>{
			//create a mongodb form object	to save it into database
			var form = new FormModel(request.payload);

			//call save method to save it and pass call back method to handel a error
			form.save(function(err){
				if (err){
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
	}
]

export default routes;