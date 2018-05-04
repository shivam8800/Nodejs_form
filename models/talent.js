var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');

var UserModel = require('./user');

var Schema = mongoose.Schema;

var TalentSchema = new Schema({
  talent_name:{type:String,required:true,unique:true},
  description:{type:String},
  deleted:{type:Boolean,default:false}
});

const Talent = mongoose.model('Talent', TalentSchema)

module.exports = Talent;