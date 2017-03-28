'use strict'

const ETIMEOUT = process.env.ETIMEOUT
const PORT = process.env.PORT

const querystring = require('querystring')
const FlashPlayer = require('../util/flash-player')
const Emitter = require('../util/emitter')

const emitter = new Emitter()
const flashPlayer = new FlashPlayer()
const flashCallback = {role: 'api_port', cmd: 'done'}

module.exports = function() {
  this.add({role: 'api_port', cmd: 'calculate'}, calculate)
  this.add(flashCallback, done)
}

function calculate({memberId, meta$: {id}}, respond) {
  emitter.once(id, respond)
  const timeout = emitter.eventTimeout(id, ETIMEOUT)

  const urlCallbackArgs = flashCallback
  urlCallbackArgs.id = id
  const flash = flashPlayer.execute('external/Core.swf', {
    memberId,
    callbackUrl: escape(`http://127.0.0.1:${PORT}/act?`) + querystring.stringify(urlCallbackArgs)
  })
  flash.on('close', () => {
    emitter.removeAllListeners(id)
    clearTimeout(timeout)
  })
  flash.on('error', error => {
    emitter.removeAllListeners(id)
    clearTimeout(timeout)
    respond(error)
  })
}

function done({error, id, api_port}, respond) {
  emitter.emit(id, error, {api_port})
  respond(null, {
    status: 'OK',
    id
  })
}
