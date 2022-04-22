const { MongoClient } = require('mongodb')
const LoadUserByUserRepository = require('./load-user-by-email-repository')

let connection, db

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
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = connection.db()
  })

  afterAll(async () => {
    await connection.close()
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
})
