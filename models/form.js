var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');


var Schema = mongoose.Schema;

var FormSchema = new Schema({
	name: {type:String, required:true},
	email:{type:Email, required:true},
	countryCode: {type:Number,required:true},
	phone_number: {type:Number, required:true},
	interviewed_people: {type: Number, required:true},
	shoot_cities: {type: String, required: true},
	total_videos: {type: Number, required: true},
	video_length: {type: Number, required: true},
	total_budget: {type: Number, required: true}
});

const Form = mongoose.model('Form', FormSchema)

module.exports = Form;