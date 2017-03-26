'use strict'

const seneca = require('seneca')()
const apiPort = require('./api-port')

seneca.use(apiPort)

module.exports = seneca
