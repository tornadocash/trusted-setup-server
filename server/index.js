const path = require('path')
const { NODE_ENV } = process.env
require('dotenv').config({ path: path.join(__dirname, `../.env.${NODE_ENV}`) })
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')
const sessionsController = require('./controllers/authorize')
const contributionController = require('./controllers/contribute')
const models = require('./models')

const app = express()

async function start() {
  config.dev = NODE_ENV !== 'production'
  await models.sequelize.sync()
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true
    })
  )
  app.use((req, res, next) => {
    res.locals.session = req.session
    next()
  })

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.use('/api', sessionsController)
  app.use('/api', contributionController)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  app.listen(port, host, () => {
    console.log(`Server is running on port ${port}.`)
  })
}
start()
