'use strict'

const moment = require('moment-timezone')

module.exports = {
  now
}

function now(timezone = 'Europe/London') {
  const serverTime = moment(Date.now())
  return serverTime.tz(timezone).valueOf()
}
