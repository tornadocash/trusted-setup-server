const fs = require('fs').promises
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const aws = require('aws-sdk')
const express = require('express')
const { Mutex } = require('async-mutex')
const multer = require('multer')

const mutex = new Mutex()
const s3 = new aws.S3()
const router = express.Router()
const Contribution = require('../models/contributions.model.js')
const upload = multer({ dest: '/tmp/tornado' })

async function uploadToS3({ filename }) {
  const currentContributionIndex = await Contribution.currentContributionIndex()
  const fileContent = await fs.readFile(`/tmp/tornado/${filename}`)
  return s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `response_${currentContributionIndex}`,
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
  const contributions = await Contribution.getContributions()
  res.json(contributions).send()
})

router.post('/response', upload.single('response'), async (req, res) => {
  if (!req.file) {
    res.status(400).send('Missing response file')
    return
  }

  await mutex.runExclusive(async () => {
    const currentContributionIndex = await Contribution.currentContributionIndex()
    try {
      console.log(`Started processing contribution ${currentContributionIndex}`)
      await verifyResponse({ filename: req.file.filename })
    } catch (e) {
      console.error('Error', e)
      res.status(422).send(e.toString())
      return
    }

    try {
      console.log('Contribution is correct, uploading to storage')
      if (process.env.DISABLE_S3 !== 'true') {
        await uploadToS3({ filename: req.file.filename })
      }

      console.log('Committing changes')
      await fs.rename(`/tmp/tornado/${req.file.filename}`, './server/snark_files/current.params')
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
