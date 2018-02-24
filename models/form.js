var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');


var Schema = mongoose.Schema;

var FormSchema = new Schema({
	name: String,
	email:{type:Email, required:true, unique:true}
});

const Form = mongoose.model('Form', FormSchema)

module.exports = Form;