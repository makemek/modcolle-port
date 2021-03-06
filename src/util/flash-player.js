'use strict'

const ETIMEOUT = process.env.ETIMEOUT
const FLASH_PLAYER = process.env.FLASH_PLAYER

const debug = require('debug')('modcolle:port')
const path = require('path')
const querystring = require('querystring')
const execFile = require('child_process').execFile
const defaultPlayer = path.resolve(FLASH_PLAYER)

class FlashPlayer {

  constructor(player = defaultPlayer) {
    this.player = path.resolve(player)
    this.options = {timeout: ETIMEOUT}
  }

  execute(swf, flashvars) {
    swf = path.resolve(swf)
    flashvars = querystring.stringify(flashvars)
    debug(`Spawn: ${this.player} file://${swf}?${flashvars}`)
    return execFile(this.player, [`file://${swf}?${flashvars}`], this.options)
  }
}

module.exports = FlashPlayer
