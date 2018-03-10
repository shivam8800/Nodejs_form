var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');


var Schema = mongoose.Schema;

var FormSchema = new Schema({
	name: {type:String, required:true},
	email:{type:Email, required:true},
	country_code: {type:Number,required:true},
	phone_number: {type:Number, required:true}
});

const Form = mongoose.model('Form', FormSchema)

module.exports = Form;