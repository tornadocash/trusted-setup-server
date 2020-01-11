import init, { contribute } from './pkg/phase2.js';

async function main() {
    await init();

    console.log('Downloading challenge')
    let data = await fetch('challenge')
    data = await data.arrayBuffer()
    data = new Uint8Array(data)
    console.log('Source params', data)
    let result = contribute(data)
    console.log('Updated params', result)
    console.log('Uploading response')
    const formData  = new FormData();
    formData.append("response", new Blob([result], { type:"application/octet-stream" }));
    await fetch('response', {
        method: 'POST',
        body: formData
    })
    console.log('Done')
}

main().catch(console.error);