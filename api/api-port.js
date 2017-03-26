'use strict'

const ETIMEOUT = process.env.ETIMEOUT

const Emitter = require('../util/emitter')
const emitter = new Emitter()

module.exports = function(options) {
  this.add({role: 'api_port', cmd: 'calculate'}, calculate)
  this.add({role: 'api_port', cmd: 'done'}, done)
}

function calculate(memberId, respond) {
  const requestId = '1'
  emitter.once(requestId, respond)
  emitter.eventTimeout(requestId, ETIMEOUT)
}

function done(payload, respond) {
  const {request_id, result} = payload
  emitter.emit(request_id, null, {result})
  respond(null, {status: 'OK'})
}
