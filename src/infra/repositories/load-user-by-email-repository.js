const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = class LoadUserByUserRepository {
  constructor (users) {
    this.users = users
  }

  async load (email) {
    if (!email) {
      throw new MissingParamError('email')
    }

    const user = await this.users.findOne({ email }, { projection: { password: 1 } })
    return user
  }
}
