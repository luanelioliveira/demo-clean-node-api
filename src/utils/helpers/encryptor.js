const bcrypt = require('bcrypt')

module.exports = class Encryptor {
  async compare (data, hash) {
    const isValid = bcrypt.compare(data, hash)
    return isValid
  }
}
