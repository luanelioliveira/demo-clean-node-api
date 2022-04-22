const jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate (data) {
    return jwt.sign(data, 'secret')
  }
}

describe('Token Generator', () => {
  test('should return null if JWT returns null', async () => {
    const sut = new TokenGenerator()
    jwt.token = null

    const token = await sut.generate('any_data')

    expect(token).toBeNull()
  })

  test('should return a token if JWT returns token', async () => {
    const sut = new TokenGenerator()

    const token = await sut.generate('any_data')

    expect(token).toBe(jwt.token)
  })
})
