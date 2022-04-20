const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository, encrypterSpy, tokenGeneratorSpy) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypterSpy = encrypterSpy
    this.tokenGeneratorSpy = tokenGeneratorSpy
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUserByEmailRepository.load(email)

    const isValid = user && await this.encrypterSpy.compare(password, user.password)

    if (isValid) {
      const accessToken = await this.tokenGeneratorSpy.generate(user.id)
      return accessToken
    }

    return null
  }
}
