/* eslint-disable no-console */
const fs = require('fs').promises
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const crypto = require('crypto')
const aws = require('aws-sdk')
const express = require('express')
const { Mutex } = require('async-mutex')
const multer = require('multer')

const mutex = new Mutex()
const s3 = new aws.S3()
const router = express.Router()
const { Contribution } = require('../models')
const upload = multer({ dest: '/tmp/tornado' })

async function uploadToS3({ filename, contributionIndex }) {
  const fileContent = await fs.readFile(`/tmp/tornado/${filename}`)
  return s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `response_${contributionIndex}`,
      ACL: 'public-read',
      Body: fileContent
    })
    .promise()
}

async function verifyResponse({ filename }) {
  console.log('Running verifier')
  const { stdout, stderr } = await exec(
    `../bin/verify_contribution circuit.json current.params /tmp/tornado/${filename}`,
    {
      cwd: './server/snark_files/',
      env: { RUST_BACKTRACE: 1 }
    }
  )
  console.log(stdout)
  console.error(stderr)
}

router.get('/challenge', (req, res) => {
  res.sendFile('./snark_files/current.params', { root: path.join(__dirname, '../') })
})

router.get('/contributions', async (req, res) => {
  const contributions = await Contribution.findAll({
    attributes: ['id', 'name', 'company', 'handle', 'socialType', 'attestation']
  })
  res.json(contributions)
})

router.post('/response', upload.single('response'), async (req, res) => {
  if (!req.file) {
    res.status(400).send('Missing response file')
    return
  }

  await mutex.runExclusive(async () => {
    const contributionIndex = await Contribution.nextContributionIndex()
    try {
      console.log(`Started processing contribution ${contributionIndex}`)
      await verifyResponse({ filename: req.file.filename })
    } catch (e) {
      console.error('Got error during verifying', e)
      await fs.unlink(`/tmp/tornado/${req.file.filename}`)
      res.status(422).send(e.toString())
      return
    }

    try {
      const socialType = req.session.socialType || 'anonymous'
      let name = null
      let company = null
      let wallet = null
      let handle = null
      let token = null
      if (socialType !== 'anonymous' && req.body) {
        name = req.body.name || null
        company = req.body.company || null
        wallet = req.body.wallet || null
        handle = req.session.handle || null
      } else {
        token = crypto.randomBytes(32).toString('hex')
      }
      console.log('Contribution is correct, uploading to storage')
      if (process.env.DISABLE_S3 !== 'true') {
        await uploadToS3({ filename: req.file.filename, contributionIndex })
      }
      console.log('Committing changes')
      await fs.copyFile(`/tmp/tornado/${req.file.filename}`, './server/snark_files/current.params')
      await fs.copyFile(
        './server/snark_files/current.params',
        `./server/snark_files/response_${contributionIndex}`
      )

      await Contribution.create({ name, company, wallet, handle, socialType, token })

      console.log('Contribution finished.')
      res.json({ contributionIndex, token })
    } catch (e) {
      console.error('Got error during save', e)
      res.status(503).send(e.toString())
    } finally {
      await fs.unlink(`/tmp/tornado/${req.file.filename}`)
    }
  })
})

router.post('/authorize_contribution', async (req, res) => {
  if (!req.body || !req.body.name || !req.body.token) {
    res.status(404).send('Invalid request params')
  }

  const contribution = await Contribution.findOne({ where: { token: req.body.token } })
  if (!contribution) {
    res.status(404).send('There is no such contribution')
    return
  }

  if (contribution.dataValues.socialType !== 'anonymous') {
    res.status(404).send('Your contribution is already identified.')
    return
  }

  if (!req.session.socialType || req.session.socialType === 'anonymous') {
    res.status(403).send('Access forbidden')
    return
  }

  try {
    await Contribution.update(
      {
        name: req.body.name,
        company: req.body.company,
        wallet: req.body.wallet,
        handle: req.session.handle,
        socialType: req.session.socialType
      },
      { where: { id: contribution.dataValues.id }, individualHooks: true }
    )
    res.send('OK')
  } catch (e) {
    console.error('updateError', e)
    res.status(404).send('Update error')
  }
})

router.post('/get_contribution_index', async (req, res) => {
  if (!req.body || !req.body.token) {
    res.status(404).send('Wrong request params')
  }

  const contribution = await Contribution.findOne({ where: { token: req.body.token } })
  if (!contribution) {
    res.status(404).send('There is no such contribution')
    return
  }

  if (contribution.dataValues.socialType !== 'anonymous') {
    res.status(404).send('The contribution is already authorized')
    return
  }

  return res.json({ id: contribution.dataValues.id }).send()
})

module.exports = router
