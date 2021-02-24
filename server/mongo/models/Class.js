const mongoose = require('mongoose'),
  Schema = mongoose.Schema


/* ================================================================================================
  CLASS SCHEMA & MODEL
================================================================================================ */

const ClassSchema = new Schema({
  name: String,
  bab: String,
  saves: {
    fort: String,
    ref: String,
    will: String
  },
  special: {
    1: [String],
    2: [String],
    3: [String],
    4: [String],
    5: [String],
    6: [String],
    7: [String],
    8: [String],
    9: [String],
    10: [String],
    11: [String],
    12: [String],
    13: [String],
    14: [String],
    15: [String],
    16: [String],
    17: [String],
    18: [String],
    19: [String],
    20: [String]
  },
  alignments: [String],
  hitDie: Number,
  skills: [String],
  skillPoints: Number,
  weaponProf: [String],
  armorProf: [String],
  gold: Number,
  cl: Number,
  spellsKnown: {
    1: [Number],
    2: [Number],
    3: [Number],
    4: [Number],
    5: [Number],
    6: [Number],
    7: [Number],
    8: [Number],
    9: [Number],
    10: [Number],
    11: [Number],
    12: [Number],
    13: [Number],
    14: [Number],
    15: [Number],
    16: [Number],
    17: [Number],
    18: [Number],
    19: [Number],
    20: [Number]
  },
  spellsPerDay: {
    1: [Number],
    2: [Number],
    3: [Number],
    4: [Number],
    5: [Number],
    6: [Number],
    7: [Number],
    8: [Number],
    9: [Number],
    10: [Number],
    11: [Number],
    12: [Number],
    13: [Number],
    14: [Number],
    15: [Number],
    16: [Number],
    17: [Number],
    18: [Number],
    19: [Number],
    20: [Number]
  }
})

const Class = mongoose.model('Class', ClassSchema)


/* ================================================================================================
  EXPORT CLASS MODEL
================================================================================================ */

module.exports = Class