var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');

var TalentModel = require('./talent');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username:{ type: String, required: true},
	email:{type:Email, required:true, unique: true },
	phone_number:{ type: Number, required: true, unique: true },
	otp:{ type: Number, required: true },
	talent_id: [{ type:  Schema.Types.ObjectId, ref: TalentModel}]
});

const User = mongoose.model('User', UserSchema)

module.exports = User;
