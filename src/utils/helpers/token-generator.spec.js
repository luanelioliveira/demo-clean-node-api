jest.mock('jsonwebtoken', () => ({
  token: 'any_token',
  data: '',
  secret: '',
  sign (data, secret) {
    this.data = data
    this.secret = secret
    return this.token
  }
}))

const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')
const TokenGenerator = require('./token-generator')

const makeSut = () => {
  const sut = new TokenGenerator('any_secret')
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

  test('should call JWT with correct values', async () => {
    const { sut } = makeSut()

    await sut.generate('any_data')

    expect(jwt.data).toEqual({ data: 'any_data' })
    expect(jwt.secret).toBe('any_secret')
  })

  test('should throw if no data are provided', async () => {
    const { sut } = makeSut()

    expect(sut.generate()).rejects.toThrow(new MissingParamError('data'))
  })

  test('should throw if no data are provided', async () => {
    const sut = new TokenGenerator()

    expect(sut.generate('any_data')).rejects.toThrow(new MissingParamError('secret'))
  })
})
