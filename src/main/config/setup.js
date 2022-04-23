const cors = require('../middlerwares/cors')
const jsonParser = require('../middlerwares/json-parser')

module.exports = app => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParser)
}
