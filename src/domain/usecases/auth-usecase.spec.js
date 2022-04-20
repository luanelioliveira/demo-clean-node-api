const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeLoadUserByEmailRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepository.user = {
    password: 'hashed_password'
  }

  return loadUserByEmailRepository
}

const makeSut = () => {
  const loadUserByEmailRepository = makeLoadUserByEmailRepositorySpy()
  const encrypterSpy = makeEncrypter()
  const sut = new AuthUseCase(loadUserByEmailRepository, encrypterSpy)
  return {
    sut,
    loadUserByEmailRepository,
    encrypterSpy
  }
}

describe('Auth UseCase', () => {
  test('should return null if email no provided', async () => {
    const { sut } = makeSut()

    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should return null if password no provided', async () => {
    const { sut } = makeSut()

    const promise = sut.auth('any_email@mail.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call loadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()

    await sut.auth('any_email@mail.com', 'any_password')

    expect(loadUserByEmailRepository.email).toBe('any_email@mail.com')
  })

  test('should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth('any_email@mail.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  test('should throw if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})

    const promise = sut.auth('any_email@mail.com', 'any_password')

    expect(promise).rejects.toThrow()
  })

  test('should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    loadUserByEmailRepository.user = null

    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')

    expect(accessToken).toBeNull()
  })

  test('should return null if an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false

    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password')

    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepository, encrypterSpy } = makeSut()

    await sut.auth('valid_email@mail.com', 'any_password')

    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepository.user.password)
  })
})
