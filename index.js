'use strict'

const service = require('./api/')
const ETIMEOUT = process.env.ETIMEOUT
const PORT = process.env.PORT

service.listen({
  timeout: ETIMEOUT,
  port: PORT,
})
