import { mongo } from 'mongoose';

var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');

var TalentModel = require('./talent');

var Schema = mongoose.Schema;

mongoose.Promise = Promise;

var UserSchema = new Schema({
	name:{ type: String, required: true},
	email:{type:Email, required:true, unique: true },
	country_code:{type:Number,required:true},
	phone_number:{ type: Number, required: true, unique: true },
	otp:{ type: Number},
	city:{ type: String },
	languages:{ type: Array },
	fee:{ type: Number },
	talent_id: [{ type:  Schema.Types.ObjectId, ref: TalentModel}],
	verified:{type:Boolean,default:false}
});

const User = mongoose.model('User', UserSchema)

module.exports = User;
