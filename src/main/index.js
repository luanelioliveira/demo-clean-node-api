const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    const app = require('./config/app')
    app.listen(env.port, () => console.log(`Server running on http://localhost:${env.port}`))
  })
  .catch(console.error)
