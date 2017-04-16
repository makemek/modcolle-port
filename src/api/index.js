'use strict'

const seneca = require('seneca')({
  log: 'silent'
})
const apiPort = require('./api-port')

seneca.use(apiPort)

module.exports = seneca
