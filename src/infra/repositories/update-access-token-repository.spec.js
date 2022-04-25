const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

let userModel

const makeSut = () => {
  const sut = new UpdateAccessTokenRepository()
  return {
    sut
  }
}

const makeFakeUser = () => {
  const fakeUser = {
    _id: 'valid_id',
    email: 'valid_email@mail.com',
    password: 'hashed_password'
  }

  return fakeUser
}

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await userModel.deleteMany({})

    const fakeUser = makeFakeUser()

    await userModel.insertOne(fakeUser)
  })

  test('should update the user with the accessToken', async () => {
    const { sut } = makeSut()

    await sut.update('valid_id', 'valid_token')

    const updatedFakeUser = await userModel.findOne({ _id: 'valid_id' })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('should throw if no params are provided', async () => {
    const { sut } = makeSut()

    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update('any_id')).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
