const request = require('supertest')
const app = require('../config/app')

describe('JSON Parser Middleware', () => {
  test('should parser body as JSON', async () => {
    app.post('/test_json_parser', (req, res) => { res.send(req.body) })

    const res = await request(app)
      .post('/test_json_parser')
      .send({ name: 'any_string' })
      .expect({ name: 'any_string' })

    expect(res.headers['access-control-allow-origin']).toBe('*')
  })
})
