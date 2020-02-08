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
    `../bin/phase2_verify_contribution circuit.json current.params /tmp/tornado/${filename}`,
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
    attributes: ['id', 'name', 'company', 'handle', 'socialType']
  })
  res.json(contributions).send()
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
      let handle = null
      let token = null
      if (socialType !== 'anonymous' && req.body) {
        name = req.body.name || null
        company = req.body.company || null
        handle = req.session.handle || null
      } else {
        token = crypto.randomBytes(32).toString('hex')
      }

      await Contribution.create({ name, company, handle, socialType, token })

      console.log('Contribution is correct, uploading to storage')
      if (process.env.DISABLE_S3 !== 'true') {
        await uploadToS3({ filename: req.file.filename, contributionIndex })
      }

      console.log('Committing changes')
      await fs.rename(`/tmp/tornado/${req.file.filename}`, './server/snark_files/current.params')
      await fs.copyFile(
        './server/snark_files/current.params',
        `./server/snark_files/response_${contributionIndex}`
      )

      console.log('Finished')
      res.json({ contributionIndex })
    } catch (e) {
      console.error('Got error during save', e)
      await fs.unlink(`/tmp/tornado/${req.file.filename}`)
      res.status(503).send(e.toString())
    }
  })
})

module.exports = router
