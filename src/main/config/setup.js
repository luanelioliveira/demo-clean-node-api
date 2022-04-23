const cors = require('../middlerwares/cors')

module.exports = app => {
  app.disable('x-powered-by')

  app.use(cors)
}
