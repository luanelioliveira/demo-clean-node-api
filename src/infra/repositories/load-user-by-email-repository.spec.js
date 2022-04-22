const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByUserRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../utils/errors/missing-param-error')
let db

const makeSut = () => {
  const users = db.collection('users')
  const sut = new LoadUserByUserRepository(users)
  return {
    users,
    sut
  }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDatabase()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany({})
  })

  test('should return null if no user is found', async () => {
    const { sut } = makeSut()

    const user = await sut.load('invalid_email@mail.com')

    expect(user).toBe(null)
  })

  test('should return an user if user is found', async () => {
    const { sut, users } = makeSut()
    const fakeUser = {
      _id: 'any_id',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }
    await users.insertOne(fakeUser)

    const user = await sut.load('valid_email@mail.com')

    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password
    })
  })

  test('should throw if no model is provided', async () => {
    const sut = new LoadUserByUserRepository()

    const promise = sut.load('any_email@mail.com')

    expect(promise).rejects.toThrow()
  })

  test('should throw if no email is provided', async () => {
    const { sut } = makeSut()

    const promise = sut.load()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
