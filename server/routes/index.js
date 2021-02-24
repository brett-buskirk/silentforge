const express = require("express"),
  mongoController = require("../mongo/mongoController"),
  router = express.Router()


/* ================================================================================================
    ROUTES
================================================================================================ */

router.route('/character')
  .get(mongoController.getAllCharacters)
  .post(mongoController.createCharacter)

router.route('/character/:characterId')
  .get(mongoController.getCharacter)
  .delete(mongoController.deleteCharacter)
  .patch(mongoController.updateCharacter)

router.route('/class/:className')
  .get(mongoController.getClassDetails)

router.route('/race/:raceName')
  .get(mongoController.getRaceDetails)

router.route('/data')
  .get(mongoController.getData)


/* ================================================================================================
    EXPORT ROUTER
================================================================================================ */

module.exports = router