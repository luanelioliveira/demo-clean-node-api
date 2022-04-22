const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missing-param-error')

module.exports = class Encryptor {
  async compare (data, hash) {
    if (!data) {
      throw new MissingParamError('data')
    }

    if (!hash) {
      throw new MissingParamError('hash')
    }

    const isValid = bcrypt.compare(data, hash)
    return isValid
  }
}
