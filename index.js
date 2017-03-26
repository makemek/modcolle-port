'use strict'

const service = require('./api/')
const ETIMEOUT = process.env.ETIMEOUT

service.listen({timeout: ETIMEOUT})
