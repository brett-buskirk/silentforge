const express = require("express"),
  logger = require("./lib/logger"),
  indexRouter = require("./routes/index")

const app = express();


/* ================================================================================================
    LOG INCOMING REQUESTS
================================================================================================ */

app.use(logger(":method :url"));


/* ================================================================================================
    BODY PARSER
================================================================================================ */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/* ================================================================================================
    SERVE STATIC FILES
================================================================================================ */

app.use(express.static(__dirname + "/build"));


/* ================================================================================================
    SIMULATED TIME LAG
================================================================================================ */

// app.use((req, res, next) => {
//   let lag = Math.floor(Math.random() * 1000) + 500
//   console.log(req.method, req.url, 'lag:', lag)
//   setTimeout(() => next(), lag)
// })


/* ================================================================================================
    API ROUTER
================================================================================================ */

app.use("/api", indexRouter);


/* ================================================================================================
    404 ERRORS
================================================================================================ */

app.use((req, res, next) => {
  res.send('CANNOT FIND REQUSTED PAGE')
});


/* ================================================================================================
    OTHER ERRORS
================================================================================================ */

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  console.log(err.stack)
  res.send(err.message)
});


/* ================================================================================================
    EXPORT APP
================================================================================================ */

module.exports = app;