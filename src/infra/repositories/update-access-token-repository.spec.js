const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

let db

const makeSut = () => {
  const users = db.collection('users')
  const sut = new UpdateAccessTokenRepository(users)
  return {
    users,
    sut
  }
}

describe('UpdateAccessToken Repository', () => {
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

  test('should update the user with the accessToken', async () => {
    const { sut, users } = makeSut()
    const fakeUser = {
      _id: 'valid_id',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }
    await users.insertOne(fakeUser)

    await sut.update('valid_id', 'valid_token')

    const updatedFakeUser = await users.findOne({ _id: 'valid_id' })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('should throw if no model is provided', async () => {
    const sut = new UpdateAccessTokenRepository()

    const promise = sut.update('any_id', 'any_token')

    expect(promise).rejects.toThrow()
  })

  test('should throw if no params are provided', async () => {
    const { sut } = makeSut()

    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update('any_id')).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
