const { MissingParamError } = require('../../utils/errors')
class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!email) {
      throw new MissingParamError('password')
    }
  }
}

describe('Auth UseCase', () => {
  test('should return null if email no provided', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should return null if password no provided', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth('any_email@mail.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
