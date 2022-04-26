
const LoginRouter = require('../../presentation/routers/login-router')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const EmailValidator = require('../../utils/helpers/email-validator')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository')
const Encryptor = require('../../utils/helpers/encryptor')
const TokenGenerator = require('../../utils/helpers/token-generator')

const env = require('../config/env')

module.exports = class LoginRouterComposer {
  static compose () {
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const updateAccessTokenRepository = new UpdateAccessTokenRepository()
    const encryptor = new Encryptor()
    const tokenGenerator = new TokenGenerator(env.tokenSecret)
    const authUseCase = new AuthUseCase({
      loadUserByEmailRepository,
      updateAccessTokenRepository,
      encryptor,
      tokenGenerator
    })
    const emailValidator = new EmailValidator()
    return new LoginRouter({
      authUseCase,
      emailValidator
    })
  }
}
