import { mongo } from 'mongoose';

var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');

var TalentModel = require('./talent');
var VendorTaskModel = require('./vendor_tasks')

var Schema = mongoose.Schema;

mongoose.Promise = Promise;

var CompletedTasksSchema = new Schema({
	response_text:{type:String},
	language:{type:String},
	task_id:{type:Schema.Types.ObjectId,ref:VendorTaskModel},
	response_files:[{type:String}]
})

var UserSchema = new Schema({
	name:{ type: String, required: true},
	email:{type:Email, required:true, unique: true },
	country_code:{type:Number,required:true},
	phone_number:{ type: Number, required: true, unique: true },
	otp:{ type: Number},
	otp_issued_for:{type:String},
	city:{ type: String },
	languages:{type: Array},
	fee:{type: Number},
	talents: [{ type:  Schema.Types.ObjectId, ref: TalentModel}],
	verified:{type:Boolean,default:false},
	gender:{type:String},
	birthdate:{type:Date},
	completed_tasks:[CompletedTasksSchema]
});

const User = mongoose.model('User', UserSchema)

module.exports = User;
