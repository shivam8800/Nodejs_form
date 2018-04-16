var mongoose = require('mongoose');
const Email = require('mongoose-type-mail');

var UserModel = require('./user');

var Schema = mongoose.Schema;

var TalentSchema = new Schema({
  fiction_writer: Boolean,
  singer: Boolean,
  social_media_influencer: Boolean,
  actor: Boolean,
  cinematographer: Boolean,
  non_fiction: Boolean,
  song_writer: Boolean,
  voice_actor: Boolean,
  user_id: [{ type: Schema.Types.ObjectId, ref: UserModel }]
});

const Talent = mongoose.model('Talent', TalentSchema)

module.exports = Talent;