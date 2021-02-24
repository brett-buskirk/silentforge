const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  { FeatSchema, SkillSchema } = require('./Character')


/* ================================================================================================
  RACE SCHEMA & MODEL
================================================================================================ */

const RaceSchema = new Schema({
  name: String,
  abilAdj: {
    str: { type: Number, default: 0 },
    dex: { type: Number, default: 0 },
    con: { type: Number, default: 0 },
    int: { type: Number, default: 0 },
    wis: { type: Number, default: 0 },
    cha: { type: Number, default: 0 }
  },
  size: { type: String, default: 'Medium' },
  speed: { type: Number, default: 30 },
  feats: [String],
  skills: [SkillSchema],
  bonusSkills: [String],
  features: [String],
  autoLang: [String],
  bonusLang: [String],
  favClass: String
})

const Race = mongoose.model('Race', RaceSchema)


 /* ================================================================================================
  EXPORT RACE MODEL
================================================================================================ */

module.exports = Race