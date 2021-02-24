const mongoose = require('mongoose'),
  Schema = mongoose.Schema


/* ================================================================================================
    SKILLS SCHEMA FOR SUBDOCUMENTS
================================================================================================ */

const SkillSchema = new Schema({
  name: String,
  classSkill: Boolean,
  abil: String,
  ranks: Number,
  race: { type: Number, default: 0 },
  class: { type: Number, default: 0 },
  feat: { type: Number, default: 0 }
})


/* ================================================================================================
    FEATS SCHEMA FOR SUBDOCUMENTS
================================================================================================ */

const FeatSchema = new Schema({
  name: String,
  focus: String,
  class: { type: Boolean, default: false },
  race: { type: Boolean, default: false }
})


/* ================================================================================================
    EQUIPMENT SCHEMA FOR SUBDOCUMENTS
================================================================================================ */

const EquipmentSchema = new Schema({
  name: String,
  qty: { type: Number, default: 1 },
  cost: Number,
  wt: Number
})


/* ================================================================================================
    WEAPON SCHEMA FOR SUBDOCUMENTS
================================================================================================ */

const WeaponSchema = new Schema({
  name: String,
  qty: { type: Number, default: 1 },
  cost: Number,
  wt: Number,
  dmg: String,
  crit: String,
  range: { type: String, default: null },
  type: String
})


/* ================================================================================================
    ARMOR SCHEMA FOR SUBDOCUMENTS
================================================================================================ */

const ArmorSchema = new Schema({
  name: String,
  qty: { type: Number, default: 1 },
  cost: Number,
  bonus: Number,
  wt: Number,
  max: {type : Number, default: null },
  pen: Number,
  fail: Number,
  speed: String
})


/* ================================================================================================
    CHARACTER SCHEMA
================================================================================================ */

const CharacterSchema = new Schema({
  name: String,
  details: {
    description: { type: String, default: null },
    personality: { type: String, default: null },
    background: { type: String, default: null },
    alignment: { type: String, default: null },
    deity: { type: String, default: null },
    age: {type: Number, default: null },
    gender: { type: String, default: null },
    height: { type: String, default: null },
    weight: { type: String, default: null },
    eyes: { type: String, default: null },
    hair: { type: String, default: null },
    skin: { type: String, default: null }
  },
  class: { type: String, default: null },
  race: {type: String, default: null },
  allowedAlignments: [String],
  abilities: {
    str:  { 
      basic: { type: Number, default: 8 },
      race: { type: Number, default: 0 },
      level: { type: Number, default: 0 },
      inherent: { type: Number, default: 0 },
      enhancement: { type: Number, default: 0 }
    },
    dex:  { 
      basic: { type: Number, default: 8 },
      race: { type: Number, default: 0 },
      level: { type: Number, default: 0 },
      inherent: { type: Number, default: 0 },
      enhancement: { type: Number, default: 0 }
    },
    con:  { 
      basic: { type: Number, default: 8 },
      race: { type: Number, default: 0 },
      level: { type: Number, default: 0 },
      inherent: { type: Number, default: 0 },
      enhancement: { type: Number, default: 0 }
    },
    int:  { 
      basic: { type: Number, default: 8 },
      race: { type: Number, default: 0 },
      level: { type: Number, default: 0 },
      inherent: { type: Number, default: 0 },
      enhancement: { type: Number, default: 0 }
    },
    wis:  { 
      basic: { type: Number, default: 8 },
      race: { type: Number, default: 0 },
      level: { type: Number, default: 0 },
      inherent: { type: Number, default: 0 },
      enhancement: { type: Number, default: 0 }
    },
    cha:  { 
      basic: { type: Number, default: 8 },
      race: { type: Number, default: 0 },
      level: { type: Number, default: 0 },
      inherent: { type: Number, default: 0 },
      enhancement: { type: Number, default: 0 }
    }
  },
  saves: {
    fort: {
      basic: { type: Number, default: 0 },
      feat: { type: Number, default: 0 },
      enhancement: { type: Number, default: 0 },
      abil: { type: Number, default: 0 }
    },
    ref: {
      basic: { type: Number, default: 0 },
      feat: { type: Number, default: 0 },
      enhancement: { type: Number, default: 0 },
      abil: { type: Number, default: 0 }
    },
    will: {
      basic: { type: Number, default: 0 },
      feat: { type: Number, default: 0 },
      enhancement: { type: Number, default: 0 },
      abil: { type: Number, default: 0 }
    }
  },
  campaign: { type: Number, default: 1},
  bab: { type: Number, default: 0 },
  skillPoints: { type: Number, default: 0 },
  maxRanks: { type: String, default: '4/2' },
  skills: [SkillSchema],
  feats: [FeatSchema],
  raceFeatures: [String],
  classFeatures: [String],
  weaponProf: [String],
  armorProf: [String],
  hp: { type: Number, default: 0 },
  speed: { type: Number, default: 30 },
  size: { type: String, default: 'Medium' },
  languages: [String],
  money: { type: Number, default: 0 },
  remainingMoney: {type: Number, default: 0 },
  equipment: [EquipmentSchema],
  weapons: [WeaponSchema],
  armor: [ArmorSchema],
  domains: [String],
  cl: { type: Number, default: 0 },
  spellsKnown: [Number],
  spellsPerDay: [Number],
  spellList: [{ name: String, level: Number }]
},
{ timestamps: {}
})

const Character = mongoose.model('Character', CharacterSchema)


/* ================================================================================================
  EXPORT MODELS AND SCHEMA
================================================================================================ */

module.exports = { Character, FeatSchema, SkillSchema }