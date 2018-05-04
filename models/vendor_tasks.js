import { mongo } from 'mongoose';

var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');

var TalentModel = require('./talent');

var Schema = mongoose.Schema;

mongoose.Promise = Promise;

var VendorTaskSchema = new Schema({
	name:{ type: String, required: true, unique:true},
	description:{type:String, required:true },
	talent: {type:Schema.Types.ObjectId, ref: 'Talent',required:true},
	response_type:{type:String,default:"file"}
});

const VendorTask = mongoose.model('VendorTask', VendorTaskSchema)

module.exports = VendorTask;
