var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');


var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username:{ type: String, required: true},
	email:{type:Email, required:true, unique: true },
	password:{ type: String, required: true }
});

const User = mongoose.model('User', UserSchema)

module.exports = User;