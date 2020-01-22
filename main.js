require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const logger = require('express-logger')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')

const fileUpload = require('express-fileupload')

const app = express()

app.set('view engine', 'ejs')

app.use(fileUpload({}))
app.use(express.static('static'))

const sessionsController = require('./controllers/sessions')
const contributionController = require('./controllers/contributions')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger({ path: 'log/express.log' }))
app.use(cookieParser())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})
app.use('/', sessionsController)
app.use('/', contributionController)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})


