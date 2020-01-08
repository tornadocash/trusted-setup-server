require('dotenv').config()
const fs = require('fs').promises
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { Mutex } = require('async-mutex')
const mutex = new Mutex()
const aws = require('aws-sdk')
const s3 = new aws.S3()
const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
app.use(fileUpload({}))
app.use(express.static('public'))

let currentContributionIndex = 0

async function uploadToS3(response) {
    try {
        await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `response${currentContributionIndex}`,
            ACL: 'public-read',
            Body: response,
        }).promise()
    } catch (err) {
        console.log(err)
    }
}

async function verifyResponse() {
    const { stdout, stderr } = await exec('./verify_transform_constrained challenge response new_challenge')
    console.log(stdout)
    console.error(stderr)
}

app.get('/challenge', async (req, res) => {
    res.sendFile('challenge', { root: __dirname })
})

app.post('/response', async (req, res) => {
    if (!req.files.response) {
        res.status(400).send('Missing response file')
        return
    }

    await mutex.runExclusive(async () => {
        console.log(`Started processing response ${currentContributionIndex}`)
        await fs.writeFile('response', req.files.response.data)
        await verifyResponse()
        await uploadToS3(req.files.response.data)
        await fs.rename('response', `response${currentContributionIndex}`)

        console.log(`Committing changes for contribution ${currentContributionIndex}`)
        await fs.rename('new_challenge', 'challenge')
        currentContributionIndex++;

        console.log('Finished')
        res.send()
    });
})

const port = process.env.PORT || 8000
app.listen(port)
console.log('Started on port', port)


