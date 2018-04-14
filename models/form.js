var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');


var Schema = mongoose.Schema;

var FormSchema = new Schema({
	projectName: {type:String, required:true},
	name: {type:String, required:true},
	email:{type:mongoose.SchemaTypes.Email, required:true},
	countryCode: {type:Number,required:true},
	phone_number: {type:Number, required:true},
	interviewed_people: {type: Number},
	shoot_cities: {type: Array},
	total_videos: {type: Number},
	video_length: {type: Number},
	total_budget: {type: Number}
});

const Form = mongoose.model('Form', FormSchema)

module.exports = Form;