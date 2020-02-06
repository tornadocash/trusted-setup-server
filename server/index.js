require('dotenv').config()
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')
const sessionsController = require('./controllers/sessions')
const contributionController = require('./controllers/contributions')
const models = require('./models')

const app = express()

async function start() {
  config.dev = process.env.NODE_ENV !== 'production'
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

  app.use('/api', sessionsController)
  app.use('/api', contributionController)

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
  })
  app.use(morgan('combined', { stream: accessLogStream }))

  // Give nuxt middleware to express
  app.use(nuxt.render)

  app.listen(port, host, () => {
    console.log(`Server is running on port ${port}.`)
  })
}
start()
