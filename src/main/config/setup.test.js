const request = require('supertest')
const app = require('./app')

describe('Setup App', () => {
  test('should disable x-powered-by from header', async () => {
    app.get('/test_x_powered_by', (req, res) => { res.send('') })

    const res = await request(app).get('/test_x_powered_by')

    expect(res.headers['x-powered-by']).toBeUndefined()
  })
})
