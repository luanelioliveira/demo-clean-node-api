const jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate (data) {
    return jwt.sign(data, 'secret')
  }
}

const makeSut = () => {
  const sut = new TokenGenerator()
  return {
    sut
  }
}

describe('Token Generator', () => {
  test('should return null if JWT returns null', async () => {
    const { sut } = makeSut()
    jwt.token = null

    const token = await sut.generate('any_data')

    expect(token).toBeNull()
  })

  test('should return a token if JWT returns token', async () => {
    const { sut } = makeSut()

    const token = await sut.generate('any_data')

    expect(token).toBe(jwt.token)
  })
})
