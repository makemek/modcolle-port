'use strict'

const service = require('./api/')
const ETIMEOUT = process.env.ETIMEOUT
const PORT = process.env.PORT

process.env.TIMEZONE = process.env.TIMEZONE || 'Asia/Tokyo'
process.env.KANCOLLE_CORE_SWF = process.env.KANCOLLE_CORE_SWF || 'bin/Core.swf'
process.env.FLASH_PLAYER = process.env.FLASH_PLAYER || 'bin/flashplayerdebugger'

service.listen({
  timeout: ETIMEOUT,
  port: PORT,
})
