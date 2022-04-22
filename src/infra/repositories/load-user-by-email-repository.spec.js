const { MongoClient } = require('mongodb')

class LoadUserByUserRepository {
  constructor (users) {
    this.users = users
  }

  async load (email) {
    const user = await this.users.findOne({ email })
    return user
  }
}

describe('LoadUserByEmail Repository', () => {
  let connection, db

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany({})
  })

  afterAll(async () => {
    await connection.close()
  })

  test('should return null if no user is found', async () => {
    const users = db.collection('users')
    const sut = new LoadUserByUserRepository(users)

    const user = await sut.load('invalid_email@mail.com')

    expect(user).toBe(null)
  })

  test('should return an user if user is found', async () => {
    const users = db.collection('users')
    const mockUser = { email: 'valid_email@mail.com' }
    await users.insertOne(mockUser)
    const sut = new LoadUserByUserRepository(users)

    const user = await sut.load('valid_email@mail.com')

    expect(user.email).toBe('valid_email@mail.com')
  })
})
