'use strict'

const EventEmitter = require('events')

class Emitter extends EventEmitter {

  /**
  * Remove all listeners within X milliseconds
  * 
  * Reason: To clear out untriggered events from piling up
  **/
  eventTimeout(targetEvent, millesecs) {
    setTimeout(() => this.removeAllListeners(targetEvent), millesecs)
  }

}

module.exports = Emitter