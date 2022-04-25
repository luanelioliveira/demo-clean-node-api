const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByUserRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../utils/errors/missing-param-error')

let userModel

const makeSut = () => {
  const sut = new LoadUserByUserRepository()
  return {
    sut
  }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await userModel.deleteMany({})
  })

  test('should return null if no user is found', async () => {
    const { sut } = makeSut()

    const user = await sut.load('invalid_email@mail.com')

    expect(user).toBe(null)
  })

  test('should return an user if user is found', async () => {
    const { sut } = makeSut()
    const fakeUser = {
      _id: 'any_id',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }
    await userModel.insertOne(fakeUser)

    const user = await sut.load('valid_email@mail.com')

    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password
    })
  })

  test('should throw if no email is provided', async () => {
    const { sut } = makeSut()

    const promise = sut.load()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
