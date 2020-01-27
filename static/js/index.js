import init, { contribute } from './pkg/phase2.js'
let initPromise = init()
document.getElementById('contributeBtn').onclick = makeContribution

const timeout = ms => new Promise(res => setTimeout(res, ms))

function status(text) {
    document.getElementById('status').innerHTML = text
    console.log(text)
}

async function makeContribution({ retry = 0 } = {}) {
    try {
        document.getElementById('contributeBtn').disabled = true
        await initPromise

        status('Downloading last contribution')
        let data = await fetch('challenge')
        data = new Uint8Array(await data.arrayBuffer())

        status('Generating random contribution')
        await timeout(100) // allow UI to update before freezing in wasm
        console.log('Source params', data)
        let result = contribute(data)
        console.log('Updated params', result)

        status('Uploading and verifying your contribution')
        const formData = new FormData()
        formData.append('response', new Blob([result], {type: 'application/octet-stream'}))
        formData.append('name', 'William') // TODO put real name here
        formData.append('company', 'Microsoft')
        let resp = await fetch('response', {
            method: 'POST',
            body: formData,
        })

        if (resp.ok) {
            status('Your contribution is verified and recorded. THX BYE.')
        } else if (resp.status === 422) {
            if (retry < 3) {
                console.log(`Looks like someone else uploaded contribution ahead of us, retrying`)
                await makeContribution({retry: retry++})
            } else {
                status(`Failed to upload your contribution after ${retry} attempts`)
            }
        } else {
            status('Error uploading your contribution')
        }
    } finally {
        document.getElementById('contributeBtn').disabled = false
    }
}