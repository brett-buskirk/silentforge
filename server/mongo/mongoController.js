const { Character } = require("./models/Character"),
  Class = require("./models/Class"),
  Race = require('./models/Race'),
  Data = require('./models/Data')

require("./mongoConnect").connect()

module.exports = {

  /* ================================================================================================
    CREATE A NEW CHARACTER TEMPLATE
  ================================================================================================ */

  createCharacter(req, res, next) {
    const character = new Character({
      name: req.body.name,
      'details.description': req.body.description,
      'details.gender': req.body.gender,
      'details.skin': req.body.skin,
      'details.hair': req.body.hair,
      'details.eyes': req.body.eyes,
      languages: ["Common"]
    })
    character.save()
      .then(() => res.json(character))
      .catch(next)
  },


  /* ================================================================================================
    GET A SPECIFIC CHARACTER'S DATA
  ================================================================================================ */

  getCharacter(req, res, next) {
    const { characterId } = req.params
    Character.findById(characterId)
      .then(character => res.json(character))
      .catch(next)
  },


  /* ================================================================================================
    GET A LIST OF ALL CHARACTERS (NAME AND _ID ONLY)
  ================================================================================================ */

  getAllCharacters(req, res, next) {
    Character.find({}, { name: 1 }).sort('name')
      .then(characters => {
        allCharacters = Array.from(characters)

        // Add an entry for None (no character selected)
        allCharacters.unshift({
          _id: 'none', name: 'None (Creating A New Character)'
        })
        res.json(allCharacters)
      })
      .catch(next)
  },


  /* ================================================================================================
    GET DATA FOR A SPECIFIC CLASS
  ================================================================================================ */

  getClassDetails(req, res, next) {
    const { className } = req.params
    Class.find({ name: className })
      .then(classDetails => res.json(classDetails[0]))
      .catch(next)
  },


  /* ================================================================================================
    GET DATA FOR A SPECIFIC RACE
  ================================================================================================ */  

  getRaceDetails(req, res, next) {
    const { raceName } = req.params
    Race.find({ name: raceName })
      .then(raceDetails => res.json(raceDetails[0]))
      .catch(next)
  },


  /* ================================================================================================
    REMOVE A CHARACTER FROM THE DATABASE
  ================================================================================================ */

  deleteCharacter(req, res, next) {
    const { characterId } = req.params
    Character.findByIdAndRemove(characterId)
      .then(character => res.json(character))
      .catch(next)
  },


  /* ================================================================================================
    UPDATE A CHARACTER'S DATA AND RETURN THE NEW CHARACTER DATA
  ================================================================================================ */

  updateCharacter(req, res, next) {
    const { characterId } = req.params
    Character.findByIdAndUpdate(characterId, req.body, { new: true })
      .then(character => res.json(character))
      .catch(next)
  },


  /* ================================================================================================
    GET APPLICATION DATA
  ================================================================================================ */
  
  getData(req, res, next) {
    Data.findOne({}, { _id: 0 })
      .then(data => res.json(data))
      .catch(next)
  }

}