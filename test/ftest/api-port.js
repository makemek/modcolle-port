'use strict'

const TIMEOUT = parseInt(process.env.ETIMEOUT)
const PORT = process.env.PORT
console.log(TIMEOUT, PORT)
const seneca = require('seneca')({
  log: 'silent',
  timeout: TIMEOUT
})
const apiPort = require('../../api/api-port')
const Promise = require('bluebird')
const should = require('should')

describe('api_port', () => {

  before(done => {
    seneca.actAsync = Promise.promisify(seneca.act, {context: seneca})
    seneca
    .use(apiPort)
    .ready(() => {
      seneca.listen({port: PORT})
      done()
    })
  })

  it(`should calculate value of api_port before seneca timeout ${TIMEOUT}ms`, () => {
    const memberId = '42'

    return seneca.actAsync({role: 'api_port', cmd: 'calculate', memberId})
    .then(result => {
      const {api_port} = result
      should.exist(api_port)
      should(api_port).not.be.empty()
      should(api_port.match(/[^0-9]/)).be.Null()
    })
  }).timeout(TIMEOUT + 50)
})
