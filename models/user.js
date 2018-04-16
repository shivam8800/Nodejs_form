var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');


var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username:{ type: String, required: true},
	email:{type:Email, required:true, unique: true },
	phone_number:{ type: Number, required: true },
	otp:{ type: Number, required: true },
});

const User = mongoose.model('User', UserSchema)

module.exports = User;