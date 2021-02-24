const mongoose = require("mongoose");


/* ================================================================================================
  SET MONGOOSE PROMISE EQUAL TO A GLOBAL PROMISE
================================================================================================ */

mongoose.Promise = global.Promise;


/* ================================================================================================
  SET MONGOOSE CONNECTION IN A FUNCTION
================================================================================================ */

function connect() {
  mongoose.connect('mongodb://localhost/silentforge', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connection to silentforge successful"))
  .catch(err => console.error(err))
}


/* ================================================================================================
  EXPORT CONNECTION FUNCTION AND MONGOOSE (WITH PROMISE ATTACHED)
================================================================================================ */

module.exports = { connect, mongoose };