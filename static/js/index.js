import init, { contribute } from './pkg/phase2.js'
let initPromise = init()
document.getElementById('contributeBtn').onclick = makeContribution

const timeout = ms => new Promise(res => setTimeout(res, ms))

function status(text) {
    document.getElementById('status').innerHTML = text
    console.log(text)
}

async function makeContribution() {
    await initPromise

    status('Downloading last contribution')
    let data = await fetch('challenge')
    data = await data.arrayBuffer()
    data = new Uint8Array(data)
    status('Generating random contribution')
    await timeout(100) // allow UI to update before freezing in wasm
    console.log('Source params', data)
    let result = contribute(data)
    console.log('Updated params', result)
    status('Uploading and verifying your contribution')
    const formData  = new FormData()
    formData.append("response", new Blob([result], { type:"application/octet-stream" }))
    await fetch('response', {
        method: 'POST',
        body: formData
    })
    status('Your contribution is verified and recorded. THX BYE.')
}