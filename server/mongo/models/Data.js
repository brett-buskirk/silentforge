const mongoose = require('mongoose'),
  Schema = mongoose.Schema


/* ================================================================================================
  DATA SCHEMA & MODEL
================================================================================================ */
const DataSchema = new Schema({
  campaigns: [Object],
  abilities: [String],
  classes: [String],
  races: [String],
  descriptions: Object,
  personalities: Object,
  languages: [String],
  skills: [Object],
  feats: [Object],
  deities: [Object],
  favoredEnemies: [Object],
  bardSpells: Object,
  sorcererSpells: Object,
  weapons: [Object],
  armor: [Object]
})

const Data = mongoose.model('Data', DataSchema)


/* ================================================================================================
  EXPORT DATA MODEL
================================================================================================ */

module.exports = Data