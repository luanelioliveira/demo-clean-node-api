const request = require('supertest')

describe('Content Type Middleware', () => {
  let app

  beforeEach(() => {
    jest.resetModules()
    app = require('../config/app')
  })
  test('should return JSON content-type as default', async () => {
    app.get('/test_content_type', (req, res) => { res.send('') })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('should return XML content-type if forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
