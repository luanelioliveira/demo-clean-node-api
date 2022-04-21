const bcrypt = require('bcrypt')
const Encryptor = require('./encryptor')

const makeSut = () => {
  const sut = new Encryptor()
  return {
    sut
  }
}

describe('Encrypter', () => {
  test('should return true if bcrypt returns true', async () => {
    const { sut } = makeSut()

    const isValid = await sut.compare('any_data', 'any_hash')

    expect(isValid).toBe(true)
  })

  test('should return false if bcrypt returns false', async () => {
    const { sut } = makeSut()
    bcrypt.isValid = false

    const isValid = await sut.compare('any_data', 'any_hash')

    expect(isValid).toBe(false)
  })

  test('should call bcrypt with correct valeus', async () => {
    const { sut } = makeSut()

    await sut.compare('any_data', 'any_hash')

    expect(bcrypt.data).toBe('any_data')
    expect(bcrypt.hash).toBe('any_hash')
  })
})
