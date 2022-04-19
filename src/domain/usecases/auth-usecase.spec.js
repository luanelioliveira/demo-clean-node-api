const { MissingParamError, InvalidParamError } = require('../../utils/errors')
class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('loadUserByEmailRepository')
    }

    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError('loadUserByEmailRepository')
    }

    await this.loadUserByEmailRepository.load(email)
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
    }
  }
  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepository)
  return {
    sut,
    loadUserByEmailRepository
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

    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })

  test('should throw if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})

    const promise = sut.auth('any_email@mail.com', 'any_password')

    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })
})
