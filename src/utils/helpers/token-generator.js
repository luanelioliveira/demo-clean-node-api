const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')

module.exports = class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (data) {
    if (!this.secret) {
      throw new MissingParamError('secret')
    }

    if (!data) {
      throw new MissingParamError('data')
    }

    return jwt.sign({ data }, this.secret)
  }
}
