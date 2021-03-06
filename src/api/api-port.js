'use strict'

const ETIMEOUT = process.env.ETIMEOUT
const PORT = process.env.PORT
const KANCOLLE_CORE_SWF = process.env.KANCOLLE_CORE_SWF
const TIMEZONE = process.env.TIMEZONE

const debug = require('debug')('modcolle:port')
const querystring = require('querystring')
const FlashPlayer = require('../util/flash-player')
const Emitter = require('../util/emitter')
const serverTime = require('../util/server-time')

const emitter = new Emitter()
const flashPlayer = new FlashPlayer()
const flashCallback = {role: 'api_port', cmd: 'done'}

module.exports = function() {
  this.add({role: 'api_port', cmd: 'calculate'}, calculate)
  this.add(flashCallback, done)
}

function calculate({memberId, meta$: {id}}, respond) {
  debug(`calculate api_port START: memberId=${memberId} requestId=${id}`)
  emitter.once(id, respond)
  const timeout = emitter.eventTimeout(id, ETIMEOUT)

  const urlCallbackArgs = flashCallback
  urlCallbackArgs.id = id
  const flash = flashPlayer.execute(KANCOLLE_CORE_SWF, {
    memberId,
    unixtime: serverTime.now(TIMEZONE),
    callbackUrl: escape(`http://127.0.0.1:${PORT}/act?`) + querystring.stringify(urlCallbackArgs)
  })
  flash.stdout.on('data', debug)
  flash.stderr.on('data', debug)
  flash.on('close', () => {
    debug(`terminated: memberId=${memberId} requestId=${id}`)
    emitter.removeAllListeners(id)
    clearTimeout(timeout)
  })
  flash.on('error', error => {
    debug(`error: memberId=${memberId} requestId=${id} error=${error}`)
    emitter.removeAllListeners(id)
    clearTimeout(timeout)
    respond(error)
  })
}

function done({error, id, api_port}, respond) {
  debug(`calculate api_port DONE: requestId=${id} api_port=${api_port}`)
  emitter.emit(id, error, {api_port})
  respond(null, {
    status: 'OK',
    id
  })
}
