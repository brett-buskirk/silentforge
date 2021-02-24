/* ================================================================================================
  CONSTANT VARIABLES FOR COLOR CODING
================================================================================================ */

const colors = {
  green: '\033[32m',
  yellow: '\033[33m',
  magenta: '\033[35m',
  def: '\033[39m'
}


/* ================================================================================================
  FORMAT THE CONSOLE LOG
================================================================================================ */

function serverlog(fclr, lclr, msg) {
  const { def } = colors
  console.log(fclr + '** Server Log **' + def + ' [' + new Date() + '] ' + lclr + '"' + msg + '"' + def)
}


/* ================================================================================================
  RETURN CONFIGURABLE LOGGER MIDDLEWARE
================================================================================================ */

function setup(format) {
  const regex = /:(\w+)/g
  const { green, yellow, magenta } = colors

  // Specific call for starting server
  if (format.match(regex).includes(':start')) {
    const port = format.match(/:port=(\d+)/).slice(1)
    serverlog(magenta, green, 'Server up and running on port ' + port)

  // Specific call for starting a mongo connection
  } else if (format.match(regex).includes(':mongo')) {
    const port = format.match(/:mongo=(\d+)/).slice(1)
    const host = format.match(/:host=(\w+)/).slice(1)
    serverlog(magenta, green, `MongoDB connection made at ${host}:${port}` )

  } else {
    // Return logger middleware that allows configurable methods of the request
    // object to be passed and thus logged
    return function logger(req, res, next) {
      const str = format.replace(regex, function(match, property) {
        return req[property]
      })
      serverlog(yellow, green, str)
      next()
    }
  }
}


/* ================================================================================================
  EXPORT SETUP FUNCTION
================================================================================================ */

module.exports = setup