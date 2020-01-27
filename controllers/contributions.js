const aws = require('aws-sdk')
const s3 = new aws.S3()
const fs = require('fs').promises
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const express = require('express')
const router = express.Router()
const { Mutex } = require('async-mutex')
const mutex = new Mutex()
const Contribution = require('../models/contributions.model.js')
const oauth = require('oauth')

const consumer = new oauth.OAuth(
  'https://twitter.com/oauth/request_token',
  'https://twitter.com/oauth/access_token',
  process.env.TWITTER_CONSUMER_KEY,
  process.env.TWITTER_CONSUMER_SECRET,
  '1.0A',
  process.env.TWITTER_CALLBACK_URL,
  'HMAC-SHA1')

async function uploadToS3(response) {
  const currentContributionIndex = await Contribution.currentContributionIndex()
  return await s3.upload({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `response_${currentContributionIndex}`,
    ACL: 'public-read',
    Body: response,
  }).promise()
}

async function verifyResponse() {
  console.log('Running verifier')
  const { stdout, stderr } = await exec(
    '../bin/verify_contribution circuit.json current.params /tmp/new.params', {
      cwd: './snark_files/', 
      env: { 'RUST_BACKTRACE': 1 }
    }
  )
  console.log(stdout)
  console.error(stderr)
}

router.get('/', (req, res) => {
  let userData
  consumer.get(
    'https://api.twitter.com/1.1/account/verify_credentials.json',
    req.session.oauthAccessToken,
    req.session.oauthAccessTokenSecret, 
    function (error, data,) {
      if (error) {
        console.log('error', error)
        userData = { name: 'Anonymous' }
        res.render('pages/index', { userData })
        // res.send("Error getting twitter screen name : " + util.inspect(error), 500);
      } else {
        userData = JSON.parse(data)
        req.session.twitterScreenName = userData.screen_name 
        res.render('pages/index', { userData })
      } 
    })
})

router.get('/challenge', (req, res) => {
  res.sendFile('./snark_files/current.params', { root: path.join(__dirname, '../') })
})

router.get('/contributions', async (req, res) => {
  const contributions = await Contribution.getContributions()
  res.json(contributions).send()
})

router.post('/response', async (req, res) => {
  if (!req.files.response) {
    res.status(400).send('Missing response file')
    return
  }

  await mutex.runExclusive(async () => {
    const currentContributionIndex = await Contribution.currentContributionIndex()
    try {
      console.log(`Started processing contribution ${currentContributionIndex}`)
      await fs.writeFile('/tmp/new.params', req.files.response.data)
      await verifyResponse()
    } catch (e) {
      console.error('Error', e)
      res.status(422).send(e.toString())
    }

    try {
      console.log('Contribution is correct, uploading to storage')
      // await uploadToS3(req.files.response.data)
      // await fs.copyFile(
      //   '/tmp/new.params',
      //   `./snark_files/response_${currentContributionIndex}`
      // )

      console.log('Committing changes')
      await fs.rename('/tmp/new.params', './snark_files/current.params')
      await Contribution.insertContributionInfo(
        req.body ? req.body.name || null : null,
        req.body ? req.body.company || null : null
      )
      console.log('Finished')
      res.send()
    } catch (e) {
      console.error('Error', e)
      res.status(503).send(e.toString())
    }
  })
})

module.exports = router