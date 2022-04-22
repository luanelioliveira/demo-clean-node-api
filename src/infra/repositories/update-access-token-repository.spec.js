const MongoHelper = require('../helpers/mongo-helper')

let db

class UpdateAccessTokenRepository {
  constructor (users) {
    this.users = users
  }

  async update (userId, accessToken) {
    this.users.updateOne({ _id: userId }, { $set: { accessToken } })
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
    const users = db.collection('users')
    const fakeUser = {
      _id: 'valid_id',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }
    await users.insertOne(fakeUser)
    const sut = new UpdateAccessTokenRepository(users)

    await sut.update('valid_id', 'valid_token')

    const updatedFakeUser = await users.findOne({ _id: 'valid_id' })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })
})
