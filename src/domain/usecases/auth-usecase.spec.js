const { MissingParamError } = require('../../utils/errors')
class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
  }
}

describe('Auth UseCase', () => {
  test('should return null if email no provided', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
