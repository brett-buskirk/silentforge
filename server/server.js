const http = require("http"),
  app = require("./app")

  
/* ================================================================================================
    SET PORT
================================================================================================ */

const port = 3001
app.set("port", port)


/* ================================================================================================
    CREATE HTTP SERVER
================================================================================================ */

const server = http.createServer(app)


/* ================================================================================================
    LISTEN ON PROVIDED PORT, ON ALL NETWORK INTERFACES
================================================================================================ */

server.listen(port)
server.on("error", onError)
server.on("listening", onListening)


/* ================================================================================================
    EVENT LISTENER FOR HTTP SERVER "ERROR" EVENT
================================================================================================ */

function onError(error) {
  if (error.syscall !== "listen") throw error

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`Port ${port} requires elevated privileges`)
      process.exit(1)
      break
    case "EADDRINUSE":
      console.error(`Port ${port} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}


/* ================================================================================================
    EVENT LISTENER FOR HTTP SERVER "LISTENING" EVENT
================================================================================================ */

function onListening() {
  const addr = server.address()
  console.log(`Listening on port ${addr.port}`)
}
