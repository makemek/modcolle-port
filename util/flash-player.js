'use strict'

const ETIMEOUT = process.env.ETIMEOUT

const path = require('path')
const querystring = require('querystring')
const execFile = require('child_process').execFile
const defaultPlayer = path.resolve('external', 'flashplayerdebugger')

class FlashPlayer {

  constructor(player = defaultPlayer) {
    this.player = path.resolve(player)
    this.options = {timeout: ETIMEOUT}
  }

  execute(swf, flashvars) {
    swf = path.resolve(swf)
    flashvars = querystring.stringify(flashvars)
    console.log(this.player, swf, flashvars)
    return execFile(this.player, [`file://${swf}?${flashvars}`], this.options)
  }
}

module.exports = FlashPlayer
