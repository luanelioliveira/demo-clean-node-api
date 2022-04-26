const request = require('supertest')
const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const bcrypt = require('bcrypt')

let userModel

describe('Login Routes', () => {
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

  test('should return 200 when valid credentials are provided', async () => {
    const fakeUser = {
      email: 'valid_email@mail.com',
      password: bcrypt.hashSync('hashed_password', 10)
    }
    await userModel.insertOne(fakeUser)

    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      })
      .expect(200)
  })

  test('should return 401 when invalid credentials are provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: 'invalid_password'
      })
      .expect(401)
  })
})
